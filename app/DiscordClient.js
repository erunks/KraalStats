'use strict';

import Discord from 'discord.js';
import CommandHandler from './CommandHandler';
import * as messages from './messages';

class DiscordClient {
	constructor() {
		this.client = new Discord.Client();
		this.commandHandler = new CommandHandler(this);
	}

	start() {
		this.client.on('ready', () => {
			console.log(`${messages.LOGIN} ${this.client.user.tag}!`);
		});
		this.client.on('disconnect', () => {
			console.log(`${messages.LOGOUT} ${messages.SHUTDOWN}`);
		});
		this.client.on('error', (e) => {
			console.error(`ERROR: ${e}`);
		});
		this.client.on('message', (message) => {
			this._recieve(message);
		});
		this.client.login(process.env.DISCORD_BOT_SECRET);
	}

	stop() {
		this.client.destroy();
		process.exit(0);
	}

	_messageBeginsWithPrefix(message, prefix) {
		const regex = new RegExp(`^${prefix}`);
		return message.content.match(regex) !== null;
	}

	_recieve(message) {
		let prefix = null;
		console.log(
			this.client.user.username,
			this.client.user.tag,
			this.client.user.id,
			message.content
		);
		if (
			this._messageBeginsWithPrefix(
				message,
				process.env.DISCORD_MESSAGE_PREFIX
			)
		) {
			prefix = process.env.DISCORD_MESSAGE_PREFIX;
		} else if (
			this._messageBeginsWithPrefix(message, `<@${this.client.user.id}>`)
		) {
			prefix = `<@${this.client.user.id}>`;
		} else {
			return null; //Early bail out
		}

		const regex = new RegExp(`^(${prefix})`);
		let split = message.content
			.replace(regex, '')
			.split(' ')
			.filter((string) => {
				return string !== '';
			});
		const command = split.shift().toLowerCase();
		const args = split;

		this._handleCommands(message, command, args);
	}
}

module.exports = DiscordClient;
