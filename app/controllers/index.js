import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['game', 'navbar'],

  username: Ember.computed.alias('controllers.navbar.username'),

  Card: Ember.Object.extend({
    name: '',
    url: '',
    /*atk: Ember.computed('stargazers_count', function(key, val) {
      return this.get('stargazers_count') || 1
    }),
    def: Ember.computed('forks_count', function(key, val) {
      return this.get('forks_count') || 1
    }),*/
    atk: 4,
    def: 4,
    language: Ember.computed(function(key, val) {
      return val || '????';
    }),
  }),

  // All the cards you have available
  library: [],

  // The current card
  current: null,

  actions: {
    showCurrent: function(data) {
      this.set('current', data);
    },

    addToDeck: function(data) {
      deck.pushObject(data);
      library.removeObject(data);
    },

    removeFromDeck: function(data) {
      deck.removeObject(data);
      library.pushObject(data);
    }
  },

  // Cards in your deck
  deck: Ember.computed.alias('controllers.game.deck'),

  // If we are waiting for a game
  waitingForGame: false,

  activeGames: 0,

});
