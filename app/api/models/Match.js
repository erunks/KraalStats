/**
 * Match.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    tournament_match: {
      type: 'boolean',
      defaultTo: false
    },

    stocks_taken_by_player_one: {
      type: 'number',
      required: true
    },

    stage_chosen_by_player_one: {
      type: 'boolean',
      defaultTo: false
    },

    stocks_taken_by_player_two: {
      type: 'number',
      required: true
    },

    stage_chosen_by_player_two: {
      type: 'boolean',
      defaultTo: false
    }

    created_at: {
      type: 'number',
      defaultTo: Date.now()
    },

    updated_at: {
      type: 'number',
      defaultTo: Date.now()
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    stage: {
      model: 'stage'
    },

    players: {
      collection: 'player',
      via: 'matches'
    },

    fighters: {
      collection: 'fighter',
      via: 'matches'
    }

  },

};

