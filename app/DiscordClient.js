'use strict';

class DiscordClient {
	constructor() {
		const Discord = require('discord.js');
		this.client = new Discord.Client();
		this.messages = require('./messages.json');
		const DatabaseClient = require('./DatabaseClient.js');
		this.database = new DatabaseClient();
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
		this.client.login(process.env.DISCORD_BOT_SECRET);
	};

	stop() {
		this.client.destroy();
		process.exit(0);
	};

	_recieve(message) {
		let prefix = null;
		console.log(this.client.user.username, this.client.user.tag, this.client.user.id, message.content);
		if(this._messageBeginsWithPrefix(message, process.env.DISCORD_MESSAGE_PREFIX)) {
			prefix = process.env.DISCORD_MESSAGE_PREFIX;
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
				if(this._hasPermissions(message, 'Bot Manager')){
					let promise = new Promise((resolve,reject) => {
						resolve(message.reply(this.messages.SHUTDOWN));
					}).then((result) => {
						this.stop();
					}).catch((error) => {
						throw error;
					});
				}
				else{
					message.reply(this.messages.MISSING_PERMISSIONS)
				}
				break;
			case 'report':
				const regex = /!report (random )?(friendly|tournament) (\w+)\((.+)\) (\d) to (\w+|\?)\((.+)\) (\d) on (.+)/;
				let match = message.toString().split(regex);
				console.log(match, match[1], match[0] === undefined)
				if (match.length <= 1) {
					new Promise((resolve,reject) => {
						resolve(message.reply('Format invalid! Match reporting failed!'));
					}).then((result) => {
						console.error('Format invalid! Match reporting failed!');
					}).catch((error) => {
						throw error;
					});
				} else {
					new Promise((resolve,reject) => {
						resolve(this._reportMatch(match[3], match[4], parseInt(match[5],10), match[6], match[7], parseInt(match[8], 10), match[9], !!match[1], !!match[2]));
					}).then((result) => {
						message.reply('Match reported successfully!');
					}).catch((error) => {
						throw error;
					});
				}
				break;
			default: 
				message.reply(`Sorry, I don't know how to respond to '${command}' yet.`);
		};
	};

	_hasPermissions(message, role) {
		return message.member.roles.find('name', role);
	};

	_reportMatch(playerOne, fighterOne, stocksTakenByPlayerOne, playerTwo, fighterTwo, stocksTakenByPlayerTwo, stage, stageChosenByPlayerOne = false, tournamentMatch = false) {
		let playerOneId = this.database.findOrCreatePlayer(playerOne);
		let fighterOneId = this.database.findFighter(fighterOne);
		let playerTwoId = this.database.findOrCreatePlayer(playerTwo);
		let fighterTwoId = this.database.findFighter(fighterTwo);
		let stageId = this.database.findStage(stage);
		let time = this.database._getTime();

		// let results = this.database.query(
		// 	`INSERT INTO matches (stage_id, player_one_id, fighter_one_id, player_two_id, fighter_two_id, tournament_match, stocks_taken_by_playe_one, stocks_lost_by_playe_one, stage_chosen_by_player_one, createdAt, updatedAt)
		// 	VALUES (${stageId}, ${playerOneId}, ${fighterOneId}, ${playerTwoId}, ${fighterTwoId}, ${tournamentMatch}, ${stocksTakenByPlayerOne}, ${stocksTakenByPlayerTwo}, ${stageChosenByPlayerOne}, ${time}, ${time});`);

		return results;
	};
};


module.exports = DiscordClient;