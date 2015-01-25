import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    logout: function () {
      location.reload();
    },
    tick: function() {
      // Just gobblin your tick action call
      // because game.actions.tick calls it in a Ember.run.later
      // this could be hit and we dont care
    },
  },
});
