'use strict';

import DatabaseClient from './DatabaseClient';
import { ADMIN, BOT_MANAGER } from '../modules/DiscordRoles';
import * as messages from './messages';

const MATCH_REGEX = /!report (random )?(friendly|tournament) (\w+)\((.+)\) (\d) to (\w+|\?)\((.+)\) (\d) on (.+)/;
const COMMAND_REGEX = /!set_command call: (\w+) answer: (.+)/;

class CommandHandler {
	constructor(client) {
		this.client = client;
		this.customCommands = this.database.getCustomCommands();
		this.database = new DatabaseClient();
	}

	_confirmFormatting(message, regex, errorMessgae) {
		let match = message.toString().split(regex);
		if (match.length <= 1) {
			new Promise((resolve) => {
				resolve(message.reply(errorMessgae));
			})
				.then((result) => {
					console.error(errorMessgae);
				})
				.catch((error) => {
					throw error;
				});
			return false;
		} else {
			return match;
		}
	}

	async _handleCommands(message, command, ...args) {
		switch (command) {
			case 'ping':
				message.reply(this.messages.PONG);
				break;
			case 'shutdown':
				this._handleShutdown(message);
				break;
			case 'fighters':
				this._printFighters(message);
				break;
			case 'report':
				this._handleMatchReporting(message);
				break;
			case 'set_command':
				this._handleCommandSetting(message);
				break;
			case 'stages':
				this._printStages(message);
				break;
			default:
				this._handleDefaultMessage(command, message);
		}
	}

	_handleCommandSetting(message) {
		const match = this._confirmFormatting(
			message,
			COMMAND_REGEX,
			`${messages.FORMAT_INVALID} ${messages.SET_COMMAND_FAILED}`
		);
		if (match && this._hasPermissions(message, ADMIN)) {
			new Promise(async (resolve) => {
				resolve(await this.database.setCommand(match[1], match[2]));
			})
				.then((result) => {
					message.reply(messages.SET_COMMAND_SUCCESSFUL);
				})
				.catch((error) => {
					throw error;
				});
		}
	}

	async _handleDefaultMessage(command, message) {
		message.reply(
			`Sorry, I don't know how to respond to '${command}' yet.`
		);
	}

	_handleMatchReporting(message) {
		const match = this._confirmFormatting(
			message,
			MATCH_REGEX,
			`${messages.FORMAT_INVALID} ${messages.MATCH_REPORT_FAILED}`
		);
		if (match) {
			new Promise(async (resolve) => {
				resolve(
					await this.database.reportMatch(
						match[3],
						match[4],
						parseInt(match[5], 10),
						match[6],
						match[7],
						parseInt(match[8], 10),
						match[9],
						match[1] !== 'random',
						match[2] !== 'friendly'
					)
				);
			})
				.then((result) => {
					message.reply(messages.MATCH_REPORT_SUCCESSFUL);
				})
				.catch((error) => {
					throw error;
				});
		}
	}

	_handleShutdown(message) {
		if (this._hasPermissions(message, BOT_MANAGER)) {
			new Promise((resolve) => {
				resolve(message.reply(this.messages.SHUTDOWN));
			})
				.then((result) => {
					this.client.stop();
				})
				.catch((error) => {
					throw error;
				});
		} else {
			message.reply(this.messages.MISSING_PERMISSIONS);
		}
	}

	_hasPermissions(message, role) {
		return message.member.roles.find('name', role);
	}

	async _printFighters(message) {
		let fighters = await this.database._getFighters();
		fighters = fighters.map((fighter) => {
			return fighter.name;
		});
		message.reply(`Fighters: ${fighters}`);
	}

	async _printStages(message) {
		let stages = await this.database._getStages();
		stages = stages.map((stage) => {
			return stage.name;
		});
		message.reply(`Stages: ${stages}`);
	}
}

module.exports = CommandHandler;
