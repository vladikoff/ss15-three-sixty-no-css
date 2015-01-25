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

  actions: {
    didTransition: function() {
      // Start up the tick
      this.controllerFor('index').set('waitingForGame', false)
      this.send('tick')
    },

    // THE MAIN GAME TICK
    tick: function() {
      var interval = 1000
      var clockMax = 30 * 1000 // in seconds

      var promises = [];
      var gameCtrl = this.controllerFor('game');
      var store = this.store;
      var {clock, turn} = gameCtrl.getProperties('clock', 'turn');
      var username = this.controllerFor('navbar').get('username');

      var p = store.find('game', gameCtrl.get('id')).then((game) => {
        var opponent = (game.get('id') === username) ? game.get('opponent') : game.get('id');
        var delta = moment().utc() - game.get('lastTurnSwitch')
        //Ember.Logger.info('Game tick, last switch: ' + (delta / 1000) + 's ago');

        // Is it our turn?
        if (game.get('turn') === username) {
          // Has our time expired?
          if (delta >= clockMax) {
            Ember.Logger.info('Switching turns...');
            game.set('lastTurnSwitch', moment().utc())
            game.set('turn', opponent)
          }
          gameCtrl.set('turn', true)
          gameCtrl.set('opponentProbablyLeft', false)
        } else {
          // Has the other user's time expired?
          if (delta >= clockMax) {
            gameCtrl.set('opponentProbablyLeft', true)
          }
          gameCtrl.set('turn', false)
        }

        gameCtrl.set('clock', parseInt((clockMax - delta) / 1000))

        return game.save();
      });
      promises.push(p);

      Ember.RSVP.all(promises).then(() => {
        Ember.run.later(() => {
          this.send('tick')
        }, interval)
      })
    },

    // Manually end your turn
    endTurn: function() {
      var username = this.controllerFor('navbar').get('username');
      this.store.find('game', this.controllerFor('game').get('id')).then((game) => {
        var opponent = (game.get('id') === username) ? game.get('opponent') : game.get('id');
        game.set('lastTurnSwitch', moment().utc())
        game.set('turn', opponent)
        return game.save()
      }).then(() => {
        this.controllerFor('game').set('turn', false)
      })
    },

  }
});
