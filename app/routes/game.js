import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function() {
    this.username = this.controllerFor('navbar').get('username');
    this.debug = location.search.indexOf('debug') > -1;

    if (!this.username && !this.debug) {
      this.transitionTo('index');
    }
  },

  // When opponent has changed, update avatar url
  _getOpponentAvatar: function() {
    var gameCtrl = this.controllerFor('game')
    var opponent = gameCtrl.get('opponent')
    this.controllerFor('application').gh('users/' + opponent).then((user) => {
      gameCtrl.set('opponentAvatarUrl', user.avatar_url)
    })
  },

  actions: {
    didTransition: function() {
      // Observe opponent
      var gameCtrl = this.controllerFor('game')
      Ember.addObserver(gameCtrl, 'opponent', this, this._getOpponentAvatar)

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
      var id = gameCtrl.get('id')

      // Properties we sync on every tick
      var syncProps = [
        'creatorHealth',
        'opponentHealth',
      ].concat(gameCtrl.get('boardKeys'))

      if (id) {
        var p = store.find('game', id).then((game) => {
          gameCtrl.set('isOpponent', !!(game.get('id') === username))
          var opponent = (game.get('id') === username) ? game.get('opponent') : game.get('id');
          var delta = moment().utc() - game.get('lastTurnSwitch')
          //Ember.Logger.info('Game tick, last switch: ' + (delta / 1000) + 's ago');

          gameCtrl.set('opponent', opponent)

          // Is it our turn?
          if (game.get('turn') === username) {
            // Has our time expired?
            if (delta >= clockMax) {
              Ember.Logger.info('Switching turns...');
              game.set('lastTurnSwitch', moment().utc())
              game.set('turn', opponent)
            }
            gameCtrl.set('opponentProbablyLeft', false)
          } else {
            // Has the other user's time expired?
            if (delta >= clockMax) {
              gameCtrl.set('opponentProbablyLeft', true)
            }
          }

          // Set controller values
          gameCtrl.set('clock', parseInt((clockMax - delta) / 1000))
          gameCtrl.set('turn', game.get('turn'))
          syncProps.forEach((p) => {
            gameCtrl.set(p, game.get(p))
          })

          return game.save();
        });
        promises.push(p);
      }

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

    // When a card is selected
    selectCard: function(card) {
      this.controllerFor('game').set('lastSelectedCard', card)
    },

    // Call to set a specific board position
    setBoard: function(pos) {
      var gameCtrl = this.controllerFor('game')
      var username = this.controllerFor('navbar').get('username')
      var card = gameCtrl.get('lastSelectedCard.id')

      // Not your turn or no selected card
      if (gameCtrl.get('turn') !== username || !card) return

      var id = gameCtrl.get('id')
      if (id) {
        Ember.Logger.info('Save card to ctrl/db: ', pos, card)
        this.store.find('game', id).then((game) => {
          gameCtrl.set(pos, card)
          game.set(pos, card)
          return game.save()
        })
      }
    },

  }
});
