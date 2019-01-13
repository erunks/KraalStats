
exports.up = function(knex, Promise) {
	return knex.schema.createTable('players', (table) => {
		table.increments('id');
		table.string('name').unique();
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('players');
};
