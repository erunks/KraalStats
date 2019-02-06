exports.up = function(knex, Promise) {
	return knex.schema.createTable('matches', (table) => {
		table.increments('id');
		table
			.integer('stage_id')
			.unsigned()
			.notNullable();
		table.foreign('stage_id').references('stages.id');
		table
			.integer('player_one_id')
			.unsigned()
			.notNullable();
		table.foreign('player_one_id').references('players.id');
		table
			.integer('fighter_one_id')
			.unsigned()
			.notNullable();
		table.foreign('fighter_one_id').references('fighters.id');
		table
			.integer('stocks_taken_by_player_one')
			.unsigned()
			.defaultTo(0);
		table.boolean('stage_chosen_by_player_one').defaultTo(false);
		table
			.integer('player_two_id')
			.unsigned()
			.notNullable();
		table.foreign('player_two_id').references('players.id');
		table
			.integer('fighter_two_id')
			.unsigned()
			.notNullable();
		table.foreign('fighter_two_id').references('fighters.id');
		table
			.integer('stocks_taken_by_player_two')
			.unsigned()
			.defaultTo(0);
		table.boolean('stage_chosen_by_player_two').defaultTo(false);
		table.boolean('tournament_match').defaultTo(false);
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('matches');
};
