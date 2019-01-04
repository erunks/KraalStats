'use strict';

class DatabaseClient {
	constructor() {
		const mysql = require('mysql');
		this.messages = require('./messages.json');
		this.pool = mysql.createPool({
			connectionLimit : 10,
			host			: process.env.GEARHOST_HOST_URL,
			user			: process.env.GEARHOST_USER_NAME,
			password		: process.env.GEARHOST_USER_PASS,
			database		: process.env.GEARHOST_DATABASE
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
};