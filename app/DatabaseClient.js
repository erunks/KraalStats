'use strict';

import { _toJSONObject, _query, _insert } from '../lib/databaseUtils';

class DatabaseClient {
	constructor() {
		this.knex = require('knex')({
			client: 'mysql',
			connection: {
				host: process.env[`GEARHOST_${process.env.ENV}_HOST_URL`],
				user: process.env[`GEARHOST_${process.env.ENV}_USER_NAME`],
				password: process.env[`GEARHOST_${process.env.ENV}_USER_PASS`],
				database: process.env[`GEARHOST_${process.env.ENV}_DATABASE`],
			},
			pool: {
				min: 0,
				max: 10,
			},
			migrations: {
				directory: './db/migrations',
				tableName: 'migrations',
			},
			seeds: {
				directory: './db/seeds',
			},
		});
	}

	async _getCommandResponse(commandName) {
		return await _query(this.knex, {
			from: 'commands',
			where: { call: commandName },
			returnFunction: (res) => _toJSONObject(res).answer,
		});
	}

	async _getFighters() {
		return await _query(this.knex, { from: 'fighters' });
	}

	async _getPlayers() {
		return await _query(this.knex, { from: 'players' });
	}

	async _getStages() {
		return await _query(this.knex, { from: 'stages' });
	}

	// TODO - Finish this command
	async createOrUpdateCommand(call, answer) {
		return await _query(this.knex, {
			select: 'id',
			from: 'commands',
			where: {
				call: call,
			},
			returnFunction: (res) => _toJSONObject(res).id,
		});
	}

	async getCustomCommands() {
		return await _query(this.knex, {
			from: 'commands',
			returnFunction: (res) => _toJSONObject(res).call,
		});
	}

	async findFighter(fighterName) {
		return await _query(this.knex, {
			from: 'fighters',
			where: { name: fighterName },
			returnFunction: (res) => _toJSONObject(res).id,
		});
	}

	async findOrCreatePlayer(playerName) {
		return await _query(this.knex, {
			select: 'id',
			from: 'players',
			where: { name: playerName },
			returnFunction: (res) => _toJSONObject(res).id,
			errorFunction: async () => {
				await _insert(this.knex, {
					table: 'players',
					insert: { name: playerName },
				});
				return await _query(this.knex, {
					select: 'id',
					from: 'players',
					where: { name: playerName },
					returnFunction: (res) => _toJSONObject(res).id,
				});
			},
		});
	}

	async findStage(stageName) {
		return await _query(this.knex, {
			from: 'stages',
			where: { name: stageName },
			returnFunction: (res) => _toJSONObject(res).id,
		});
	}

	async reportMatch(
		playerOne,
		fighterOne,
		stocksTakenByPlayerOne,
		playerTwo,
		fighterTwo,
		stocksTakenByPlayerTwo,
		stage,
		stageChosenByPlayer = false,
		tournamentMatch = false
	) {
		let playerOneId = await this.findOrCreatePlayer(playerOne);
		let fighterOneId = await this.findFighter(fighterOne);
		let playerTwoId = await this.findOrCreatePlayer(playerTwo);
		let fighterTwoId = await this.findFighter(fighterTwo);
		let stageId = await this.findStage(stage);

		let results = await _insert(this.knex, {
			table: 'matches',
			insert: {
				stage_id: stageId,
				player_one_id: playerOneId,
				fighter_one_id: fighterOneId,
				stocks_taken_by_player_one: stocksTakenByPlayerOne,
				stage_chosen_by_player_one: stageChosenByPlayer,
				player_two_id: playerTwoId,
				fighter_two_id: fighterTwoId,
				stocks_taken_by_player_two: stocksTakenByPlayerTwo,
				stage_chosen_by_player_two: stageChosenByPlayer,
				tournament_match: tournamentMatch,
			},
		});

		return results;
	}
}

module.exports = DatabaseClient;
