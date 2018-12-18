let config;

try {
	config = require('./config.json');
} catch(e) {
	config = {
		"DISCORD_BOT_SECRET": os.environ["DISCORD_BOT_SECRET"],
		"PAPERTRAIL_API_TOKEN": os.environ["PAPERTRAIL_API_TOKEN"]
	};
}

module.exports = config;
