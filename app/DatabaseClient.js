'use strict';

class DatabaseClient {
	constructor() {
		const mysql = require('mysql');
		this.messages = require('./messages.json');
		this.pool = mysql.createPool({
			connectionLimit : 10,
			host			: process.env[`GEARHOST${process.env.ENV}_HOST_URL`],
			user			: process.env[`GEARHOST${process.env.ENV}_USER_NAME`],
			password		: process.env[`GEARHOST${process.env.ENV}_USER_PASS`],
			database		: process.env[`GEARHOST${process.env.ENV}_DATABASE`]
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
					return [results, fields];
				}
			};
		}

		return this.pool.query(sql, callback);
	};

	_getTime() {
		return new Date().toJSON().split(/[A-Z.]/).slice(0,2).join(' ').trim();
	}

	_getFighters() {
		return this.query('SELECT * FROM fighters;');
	};

	_getPlayers() {
		return this.query('SELECT * FROM players;');
	};

	_getStages() {
		return this.query('SELECT * FROM stages;');
	};

	findFighter(fighterName) {
		let fighter = this.query(`SELET * FROM fighters WHERE name = ${fighterName};`);
		return fighter;
	};

	findOrCreatePlayer(playerName) {
		let player = this.query(
			`SELECT id FROM players WHERE name = ${playerName};`,
			(error, results, fields) => {
				if(error) {
					return this.query(`INSERT INTO players (name, createdAt, updatedAt) VALUES (${playerName}, ${this._getTime()}, ${this._getTime()});`);
				} else {
					return [results, fields];
				}
			});
		return player;
	};

	findStage(stageName) {
		let stage = this.query(`SELECT * FROM stages WHERE name = ${stageName};`);
		return stage;
	};

};

module.exports = DatabaseClient;