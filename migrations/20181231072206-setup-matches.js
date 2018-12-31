'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  return db.createTable('matches', {
  	id: { type: 'int', primaryKey: true },
  	stage_id: 'int',
  	player_one_id: 'int',
  	character_one_id: 'int',
  	player_two_id: 'int',
  	character_two_id: 'int',
  	tournament_match: 'boolean',
  	stocks_taken_by_player_one: 'int',
  	stocks_lost_by_player_one: 'int',
  	stage_chosen_by_player_one: 'boolean',
  	createdAt: 'timestamp',
  	updatedAt: 'timestamp'
  }, callback);
};

exports.down = function(db, callback) {
  return db.dropTable('matches', callback);
};

exports._meta = {
  "version": 1
};
