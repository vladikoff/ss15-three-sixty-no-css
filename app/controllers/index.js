import Ember from 'ember';

export default Ember.Controller.extend({
  Card: Ember.Object.extend({
    name: '',
    url: '',
    atk: Ember.computed('stargazers_count', function(key, val) {
      return this.get('stargazers_count') || 1
    }),
    def: Ember.computed('watchers_count', function(key, val) {
      return this.get('watchers_count') || 1
    }),
  }),

  // All the cards you have available
  library: [],
});
