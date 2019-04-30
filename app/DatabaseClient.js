'use strict';

import { _toJSONObject, _query } from '../lib/databaseUtils';

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

	async findFighter(fighterName) {
		return await _query(this.knex, {
			from: 'fighters',
			where: { name: fighterName },
			returnFunction: (res) => _toJSONObject(res).id,
		});
	}

	async findOrCreatePlayer(playerName) {
		return await this.knex
			.select('id')
			.from('players')
			.where({ name: playerName })
			.then((results) => {
				return _toJSONObject(results).id;
			})
			.catch(async (error) => {
				await this.knex('players').insert({ name: playerName });
				return await this.knex
					.select('id')
					.from('players')
					.where({ name: playerName })
					.then((results) => {
						return _toJSONObject(results).id;
					})
					.catch((error) => {
						throw error;
					});
			});
	}

	async findStage(stageName) {
		return await _query(this.knex, {
			from: 'stages',
			where: { name: stageName },
			returnFunction: (res) => _toJSONObject(res).id,
		});
	}
}

module.exports = DatabaseClient;
