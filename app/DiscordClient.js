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

	async _handleCommands(message, command, args) {
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
				if (match.length <= 1) {
					new Promise((resolve,reject) => {
						resolve(message.reply('Format invalid! Match reporting failed!'));
					}).then((result) => {
						console.error('Format invalid! Match reporting failed!');
					}).catch((error) => {
						throw error;
					});
				} else {
					new Promise(async (resolve,reject) => {
						resolve(await this._reportMatch(match[3], match[4], parseInt(match[5],10), match[6], match[7], parseInt(match[8], 10), match[9], match[1] !== 'random', match[2] !== 'friendly'));
					}).then((result) => {
						message.reply('Match reported successfully!');
					}).catch((error) => {
						throw error;
					});
				}
				break;
			case 'fighters':
				let fighters = await this.database._getFighters();
				fighters = fighters.map((fighter) => { return fighter.name });
				message.reply(`Fighters: ${fighters}`);
				break;
			case 'stages':
				let stages = await this.database._getStages();
				stages = stages.map((stage) => { return stage.name; });
				message.reply(`Stages: ${stages}`);
				break;
			default: 
				message.reply(`Sorry, I don't know how to respond to '${command}' yet.`);
		};
	};

	_hasPermissions(message, role) {
		return message.member.roles.find('name', role);
	};

	async _reportMatch(playerOne, fighterOne, stocksTakenByPlayerOne, playerTwo, fighterTwo, stocksTakenByPlayerTwo, stage, stageChosenByPlayer = false, tournamentMatch = false) {
		let playerOneId = await this.database.findOrCreatePlayer(playerOne);
		let fighterOneId = await this.database.findFighter(fighterOne);
		let playerTwoId = await this.database.findOrCreatePlayer(playerTwo);
		let fighterTwoId = await this.database.findFighter(fighterTwo);
		let stageId = await this.database.findStage(stage);
		let time = this.database._getTime();

		let results = this.database.knex('matches').insert({
			stage_id: stageId,
			player_one_id: playerOneId,
			fighter_one_id: fighterOneId,
			stocks_taken_by_player_one: stocksTakenByPlayerOne,
			stage_chosen_by_player_one: stageChosenByPlayer,
			player_two_id: playerTwoId,
			fighter_two_id: fighterTwoId,
			stocks_taken_by_player_two: stocksTakenByPlayerTwo,
			stage_chosen_by_player_two: stageChosenByPlayer,
			tournament_match: tournamentMatch
		})
		.then((result) => { return result })
		.catch((error) => { throw error });

		return results;
	};
};


module.exports = DiscordClient;