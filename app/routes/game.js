import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // User is not logged in
    var username = this.controllerFor('navbar').get('username')
    // TODO: DISABLED FOR DEBUGGING if (!username) return this.transitionTo('index')
    // Get game state and setup controller for it
  }
});
