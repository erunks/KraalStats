exports.up = function(knex, Promise) {
	return knex.schema.createTable('fighters', (table) => {
		table.increments('id');
		table.string('name').unique();
		table.boolean('dlc').defaultTo(false);
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('fighters');
};
