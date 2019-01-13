require('dotenv').config();

module.exports = {

	development: {
		client: 'mysql',
		connection: {
			host: 		process.env.GEARHOST_DEV_HOST_URL,
			user: 		process.env.GEARHOST_DEV_USER_NAME,
			password: 	process.env.GEARHOST_DEV_USER_PASS,
			database: 	process.env.GEARHOST_DEV_DATABASE,
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
	},

	production: {
		client: 'mysql',
		connection: {
			host: 		process.env.GEARHOST_PROD_HOST_URL,
			user: 		process.env.GEARHOST_PROD_USER_NAME,
			password: 	process.env.GEARHOST_PROD_USER_PASS,
			database: 	process.env.GEARHOST_PROD_DATABASE,
		},
		pool: {
			min: 1,
			max: 10,
		},
		migrations: {
			directory: './db/migrations',
			tableName: 'migrations',
		},
		seeds: {
			directory: './db/seeds',
		},
	},

};
