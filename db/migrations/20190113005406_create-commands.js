
exports.up = function(knex, Promise) {
	return knex.schema.createTable('commands', (table) => {
		table.increments('id');
		table.string('call').unique();
		table.string('response');
		table.string('help');
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('commands');
};
