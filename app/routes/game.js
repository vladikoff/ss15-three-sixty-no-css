import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function() {
    this.username = this.controllerFor('navbar').get('username');
    this.debug = location.search.indexOf('debug') > -1;

    if (!this.username && !this.debug) {
      this.transitionTo('index');
    }
  },

  model: function() {
    console.log(this.username);

    // Get game state and setup controller for it
  }
});
