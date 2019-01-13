'use strict';

class DatabaseClient {
	constructor() {
		const mysql = require('mysql');
		this.messages = require('./messages.json');
		this.database = process.env[`GEARHOST${process.env.ENV}_DATABASE`];
		this.results;
		this.pool = mysql.createPool({
			connectionLimit : 10,
			host			: process.env[`GEARHOST${process.env.ENV}_HOST_URL`],
			user			: process.env[`GEARHOST${process.env.ENV}_USER_NAME`],
			password		: process.env[`GEARHOST${process.env.ENV}_USER_PASS`],
			database		: this.database
		});
		this.pool.on('acquire', (connection) => {
			console.log('Connection %d aquired.', connection.threadId);
		});
		this.pool.on('connection', (connection) => {
			connection.query('SET SESSION auto_incerement_increment=1');
		});
		this.pool.on('enqueue', () => {
			console.log('Waiting for available connection slot...');
		});
		this.pool.on('release', (connection) => {
			console.log('Connection %d released.', connection.threadId);
		});
	};

	stop() {
		this.pool.end((error) => {
			if(error) {
				console.error('Shutdown Error: ' + error.stack);
			} else {
				console.log('Shutdown Successfully');	
			}
		});
	};

	query(sql, callback) {
		if(callback === undefined) {
			callback = (error, results, fields) => {
				if(error) {
					console.error('Query Error: ' + error);
					throw error;
				} else {
					this.results = JSON.stringify(results);
					return [results, fields];
				}
			};
		}

		return this.pool.query(sql, callback).results;
	};

	_getTime() {
		return new Date().toJSON().split(/[A-Z.]/).slice(0,2).join(' ').trim();
	}

	_getFighters() {
		let fighters = new Promise((resolve, reject) => {
			resolve(this.query(`SELECT * FROM ${this.database}.fighters;`));
		});
		return fighters;
	};

	_getPlayers() {
		let players = new Promise((resolve, reject) => {
			resolve(this.query(`SELECT * FROM ${this.database}.players;`));
		});
		return players;
	};

	_getStages() {
		let stages = new Promise((resolve, reject) => {
			resolve(this.query(`SELECT * FROM ${this.database}.stages;`));
		});
		return stages;
	};

	findFighter(fighterName) {
		let fighter = new Promise((resolve, reject) => {
			resolve(this.query(`SELECT * FROM ${this.database}.fighters WHERE name = '${fighterName}';`));
		});
		return fighter;
	};

	findOrCreatePlayer(playerName) {
		let player = new Promise((resolve, reject) => {
			resolve(
				this.query(`SELECT id FROM ${this.database}.players WHERE name = ${playerName};`,
				(error, results, fields) => {
					if(error) {
						return this.query(`INSERT INTO ${this.database}.players (name, createdAt, updatedAt) VALUES ('${playerName}', '${this._getTime()}', '${this._getTime()}');`);
					} else {
						this.reults = JSON.stringify(results);
						return [results, fields];
					}
				})
			);
		});
		return player;
	};

	findStage(stageName) {
		let stage = new Promise((resolve, reject) => {
			resolve(this.query(`SELECT * FROM ${this.database}.stages WHERE name = '${stageName}';`));
		});
		return stage;
	};

};

module.exports = DatabaseClient;
