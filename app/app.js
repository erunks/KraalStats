'use strict';

require('dotenv').config();
const DiscordClient = require('./DiscordClient.js');

const bot = new DiscordClient();
bot.start();
