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
    id: { 
      type: 'int',
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    stage_id: { 
      type: 'int', 
      notNull: true,
      foreignKey: {
        name: 'matches_stage_id_fk',
        table: 'stages',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    player_one_id: { 
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'matches_player_one_id_fk',
        table: 'players',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    fighter_one_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'matches_fighter_one_id_fk',
        table: 'fighters',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    player_two_id: { 
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'matches_player_two_id_fk',
        table: 'players',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    fighter_two_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'matches_fighter_two_id_fk',
        table: 'fighters',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
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
