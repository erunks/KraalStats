const stages = require('../../assets/stages.json');

exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex
		.select()
		.from('stages')
		.del()
		.then(function() {
			let stagesInsertion = [];
			let keys = Object.keys(stages);
			for (let i = 0; i < keys.length; i++) {
				let stage = stages[keys[i]];
				stagesInsertion.push({
					id: parseInt(keys[i], 10) + 1,
					name: stage.name,
					legal: stage.legal,
					dlc: stage.dlc,
				});
			}

			return knex('stages').insert(stagesInsertion);
		});
};
