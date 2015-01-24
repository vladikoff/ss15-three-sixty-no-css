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
  },

  afterModel: function() {
    Ember.run.later(() => {
      this.send('tick')
    })
  },

  actions: {
    // THE MAIN GAME TICK
    tick: function() {
      Ember.Logger.info('Game tick...');

      var interval = 1000
      var clockMax = 30 // in intervals

      var promises = [];
      var gameCtrl = this.controllerFor('game');
      var store = this.store;
      var {clock, turn} = gameCtrl.getProperties('clock', 'turn');
      var username = this.controllerFor('navbar').get('username');

      var p = store.find('game', gameCtrl.get('id')).then((game) => {
        var opponent = (game.get('id') === username) ? game.get('opponent') : game.get('id');

        // If it is our turn
        if (game.get('turn') === username) {
          if (clock === -1) {
            // Start our turn
            clock = clockMax;
            gameCtrl.set('clock', clockMax);
          } else if (clock === 0) {
            // Our turn is over
            clock = -1;
            game.set('turn', opponent);
          } else {
            // Keep going with our turn
            clock--;
          }
          gameCtrl.setProperties({clock: clock, turn: true})
        } else {
          // Not our turn
          gameCtrl.setProperties({ clock: 0, turn: false });
        }

        return game.save();
      });
      promises.push(p);

      Ember.RSVP.all(promises).then(() => {
        Ember.run.later(() => {
          this.send('tick')
        }, interval)
      })
    }
  },
});
