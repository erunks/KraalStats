require('dotenv').config();

const chai = require('chai');
const sinon = require('sinon');

const DatabaseClient = require('../DatabaseClient');
chai.use(require('chai-truthy'));

const expect = chai.expect;

describe('DatabaseClient', () => {
	const date = new Date('Fri May 10 2019 22:41:03 GMT - 0400');
	let clock;
	let sandbox;

	let client;

	beforeEach((done) => {
		sandbox = sinon.sandbox.create();
		clock = sinon.useFakeTimers(date.getTime());
		client = new DatabaseClient();
		done();
	});

	afterEach((done) => {
		sandbox.restore();
		clock.restore();
		done();
	});

	describe('#_getTime', () => {
		console.log(client, process.env);
		// expect(client._getTime()).to.equal('2019-05-10 22:41:03')
	});
});
