'use strict';

class Server{
	constructor() {
		const http = require('http');
		this.options = {
			hostname: process.env.HOSTNAME,
			port: process.env.PORT,
			path: '/',
			method: 'GET'
		};
		this.server = http.createServer((request, response) => {
			response.writeHead(200, {'Content-Type': 'text/plain'});
			response.write('Hello, Students\n');
			response.end();
		});
	};

	start() {
		this.server.listen(this.options.port);
	};

	stop() {
		this.server.close(() => {
			console.log('Server shutdown.');
		});
	};
};

module.exports = Server;