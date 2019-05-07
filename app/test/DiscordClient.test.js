const Collection = require('discord.js').Collection;

const expect = require('chai').expect;
const DiscordClient = require('../DiscordClient');

describe('DiscordClient', () => {
	let client;

	beforeEach(() => {
		client = new DiscordClient();
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

	//TODO
	// describe('#_hasPermissions', () => {
	//     const role = 'Admin';

	//     describe('user has permission', () => {
	//         it('returns true', () => {
	//             const message = {
	//                 member: {
	//                     roles: new Collection([
	//                         ['role', {name: 'Admin'}]
	//                     ])
	//                 }
	//             };

	//             message.member.roles.find((val) => {
	//                 console.log(val);
	//                 return val.name === role;
	//             });

	//             expect(client._hasPermissions(message, role)).to.be.true;
	//         });
	//     });

	//     describe('user does not have permission', () => {
	//         it('returns true', () => {
	//             const message = {
	//                 member: {
	//                     roles: new Collection([
	//                         ['name','User']
	//                     ])
	//                 }
	//             };

	//             console.log(message.member.roles);

	//             expect(client._hasPermissions(message, role)).to.be.true;
	//         });
	//     });
	// });
});
