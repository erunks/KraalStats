'use strict';

class DatabaseClient {
	constructor() {
		this.knex = require('knex')({
			client: 'mysql',
			connection: {
				host: 		process.env[`GEARHOST_${process.env.ENV}_HOST_URL`],
				user: 		process.env[`GEARHOST_${process.env.ENV}_USER_NAME`],
				password: 	process.env[`GEARHOST_${process.env.ENV}_USER_PASS`],
				database: 	process.env[`GEARHOST_${process.env.ENV}_DATABASE`],
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
			}
		});
	};

	_getTime() {
		return new Date().toJSON().split(/[A-Z.]/).slice(0,2).join(' ').trim();
	}

	async _getFighters() {
		return await this.knex.select().from('fighters')
			.then((results) => { return this._toJSONObject(results); })
			.catch((error) => { throw error; });
	};

	async _getPlayers() {
		return await this.knex.select().from('players')
			.then((results) => { return this._toJSONObject(results); })
			.catch((error) => { throw error; });
	};

	async _getStages() {
		return await this.knex.select().from('stages')
			.then((results) => { return this._toJSONObject(results); })
			.catch((error) => { throw error; });
	};

	async findFighter(fighterName) {
		return await this.knex.select().from('fighters').where({ name: fighterName })
			.then((results) => { return this._toJSONObject(results).id; })
			.catch((error) => { throw error; });
	};

	async findOrCreatePlayer(playerName) {
		return await this.knex.select('id').from('players').where({ name: playerName })
			.then((results) => { return this._toJSONObject(results).id; })
			.catch(async (error) => {
				await this.knex('players').insert({ name: playerName });
				return await this.knex.select('id').from('players').where({ name: playerName })
					.then((results) => { return this._toJSONObject(results).id; })
					.catch((error) => { throw error; });
			});
	};

	async findStage(stageName) {
		return await this.knex.select().from('stages').where({ name: stageName })
			.then((results) => { return this._toJSONObject(results).id; })
			.catch((error) => { throw error; });
	};

	_toJSONObject(object) {
		let jsonString = JSON.stringify(object);
		if (object.length <= 1) {
			jsonString = jsonString.substring(1, jsonString.length - 1);
			return JSON.parse(jsonString);
		} else {
			return object;
		}
	}
};

module.exports = DatabaseClient;