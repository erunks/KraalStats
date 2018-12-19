'use strict';

class DiscordClient {
	constructor() {
		const Discord = require('discord.js');
		this.client = new Discord.Client();
		this.config = require('./config.js');
		this.messages = require('./messages.json');
	};

	start() {
		this.client.on('ready', () => {
			console.log(`Logged in as ${this.client.user.tag}!`);
		});
		this.client.on('disconnect', () => {
			console.log('Logged out. Shutting down...');
		});
		this.client.on('error', (e) => {
			console.error(`ERROR: ${e}`);
		});
		this.client.on('message', message => {
			this._recieve(message);
		});
		this.client.login(this.config.DISCORD_BOT_SECRET);
	};

	stop() {
		this.client.destroy();
		process.exit(0);
	};

	_recieve(message) {
		let prefix = null;
		console.log(this.client.user.username, this.client.user.tag, this.client.user.id, message.content);
		if(this._messageBeginsWithPrefix(message, this.config.DISCORD_MESSAGE_PREFIX)) {
			prefix = this.config.DISCORD_MESSAGE_PREFIX;
		}
		else if(this._messageBeginsWithPrefix(message, `<@${this.client.user.id}>`)) {
			prefix = `<@${this.client.user.id}>`;
		}
		else{
			return null; //Early bail out
		}

		const regex = new RegExp(`^(${prefix})`);
		let split = message.content.replace(regex, '').split(' ').filter((string) => { return (string !== '') });
		const command = split.shift().toLowerCase();
		const args = split;

		this._handleCommands(message, command, args);
	};
	
	_messageBeginsWithPrefix(message, prefix) {
		const regex = new RegExp(`^${prefix}`);
		return (message.content.match(regex) !== null);
	};

	_handleCommands(message, command, args) {
		switch(command) {
			case 'ping':
				message.reply(this.messages.PONG);
				break;
			case 'shutdown':
				if(message.member.roles.find('name', 'Bot Manager')){
					let promise = new Promise((resolve,reject) => {
						resolve(message.reply(this.messages.SHUTDOWN));
					}).then((value) => {
						this.stop();
					});
				}
				else{
					message.reply(this.messages.MISSING_PERMISSIONS)
				}
				break;
			default: 
				message.reply(`Sorry, I don't know how to respond to '${command}' yet.`);
		};
	};
};


module.exports = DiscordClient;