import Ember from 'ember';

export default Ember.Controller.extend({
  Card: Ember.Object.extend({
    name: '',
    url: '',
    atk: Ember.computed('stargazers_count', function(key, val) {
      return this.get('stargazers_count') || 1
    }),
    def: Ember.computed('forks_count', function(key, val) {
      return this.get('forks_count') || 1
    }),
    language: Ember.computed(function(key, val) {
      return val || '????';
    }),
  }),

  // All the cards you have available
  library: [],

  // Cards in your deck
  deck: [],
});
