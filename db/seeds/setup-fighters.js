const fighters = require('../../assets/fighters.json');

exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex
		.select()
		.from('fighters')
		.del()
		.then(function() {
			let fightersInsertion = [];
			let keys = Object.keys(fighters);
			for (let i = 0; i < keys.length; i++) {
				let fighter = fighters[keys[i]];
				fightersInsertion.push({
					id: parseInt(keys[i], 10),
					name: fighter.name,
					dlc: fighter.dlc,
				});
			}

			return knex('fighters').insert(fightersInsertion);
		});
};
