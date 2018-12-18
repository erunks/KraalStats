const Discord = require('discord.js');
const client = new Discord.Client();
// const config = require('./config.json')

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('pong');
	}	
});

// client.login(config.DISCORD_BOT_SECRET);
client.login("NTIyNzg4NDE1NjI0NzA4MDk2.DvoNRQ.a_Qpt4SOPkALkoDPv4KWbgz37i0")
