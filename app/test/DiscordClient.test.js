const expect = require('chai').expect;
const DiscordClient = require('../DiscordClient');

describe('DiscordClient', () => {
    describe('#_messageBeginsWithPrefix', () => {
        it('should return true if a message begins with the given prefix', () => {
            const message = '!command';
            const prefix = '!';

            expect(DiscordClient._messageBeginsWithPrefix(message, prefix)).to.be.true;
        });
    });
});