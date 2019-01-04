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
   db.createTable('fighters', {
    id: { 
      type: 'int', 
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    name: 'string',
    dlc: 'boolean',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  }).then(function(result) {
    setupFighters();
  }).catch(function(error) {
    throw error;
  });

  function setupFighters() {
    var time = new Date().toJSON().split(/[A-Z.]/).slice(0,2).join(' ').trim()
    var fighters = require('../assets/fighters.json');
    for(var key in fighters){
      var fighter = fighters[key];
      db.insert(
        'fighters',
        ['name','dlc','createdAt','updatedAt'],
        [ fighter.name, fighter.dlc, time, time],
        callback
      );
    }
  }
};

exports.down = function(db, callback) {
  return db.dropTable('fighters', callback);
};

exports._meta = {
  "version": 1
};