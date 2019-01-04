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
  db.createTable('stages', {
    id: { 
      type: 'int', 
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    name: 'string',
    tournament_legal: 'boolean',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  }).then(function(result) {
    setupStages();
  });

  function setupStages() {
    var time = new Date().toJSON().split(/[A-Z.]/).slice(0,2).join(' ').trim();
    var stages = require('../assets/stages.json');
    for (var key in stages) {
      var stage = stages[key];
      db.insert(
        'stages',
        ['name','tournament_legal','createdAt','updatedAt'],
        [ stage.name, stage.legal, time, time],
        callback
      );
    }
  }
};

exports.down = function(db, callback) {
  return db.dropTable('stages', callback);
};

exports._meta = {
  'version': 1
};
