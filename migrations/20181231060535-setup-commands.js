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
  return db.createTable('commands', {
    id: { 
      type: 'int', 
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    command: 'string',
    response: 'string',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  }, callback);
};

exports.down = function(db, callback) {
  return db.dropTable('commands', callback);
};

exports._meta = {
  'version': 1
};