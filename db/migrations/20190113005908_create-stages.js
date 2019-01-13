
exports.up = function(knex, Promise) {
	return knex.schema.createTable('stages', (table) => {
		table.increments('id');
		table.string('name').unique();
		table.boolean('legal').defaultTo(false);
		table.boolean('dlc').defaultTo(false);
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('stages');
};
