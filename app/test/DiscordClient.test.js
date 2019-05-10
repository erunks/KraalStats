const Collection = require('discord.js').Collection;

const chai = require('chai');
const DiscordClient = require('../DiscordClient');
chai.use(require('chai-truthy'));

const expect = chai.expect;

describe('DiscordClient', () => {
	let client;

	beforeEach((done) => {
		client = new DiscordClient();
		done();
	});

	describe('#_messageBeginsWithPrefix', () => {
		const prefix = '!';
		describe('if a message begins with the prefix', () => {
			it('returns true', () => {
				const message = {
					content: '!command',
				};

				expect(client._messageBeginsWithPrefix(message, prefix)).to.be
					.true;
			});
		});

		describe('if a message does not begin with the prefix', () => {
			it('returns false', () => {
				const message = {
					content: 'command',
				};

				expect(client._messageBeginsWithPrefix(message, prefix)).to.be
					.false;
			});
		});
	});

	describe('#_hasPermissions', () => {
		const role = 'Admin';

		describe('user has permission', () => {
			it('returns true', () => {
				const message = {
					member: {
						roles: new Collection([['role', { name: 'Admin' }]]),
					},
				};

				expect(client._hasPermissions(message, role)).to.be.truthy();
			});
		});

		describe('user does not have permission', () => {
			it('returns true', () => {
				const message = {
					member: {
						roles: new Collection([['name', 'User']]),
					},
				};

				expect(client._hasPermissions(message, role)).to.be.falsy();
			});
		});
	});
});
