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
      this.store.unloadAll('game');
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
        'opponentBase',
        'creatorBase',
      ].concat(gameCtrl.get('boardKeys'))

      if (id) {
        var p = store.find('game', id).then((game) => {
          var opponent = (game.get('id') === username) ? game.get('opponent') : game.get('id');
          var delta = moment().utc() - game.get('lastTurnSwitch')
          //Ember.Logger.info('Game tick, last switch: ' + (delta / 1000) + 's ago');

          //Ember.Logger.info('** Setting opponent:', opponent);
          gameCtrl.set('opponent', opponent)


          // GAMEOVER CONDITIONS
          var thisIsCreator = game.get('id') === username;
          var creatorHp = game.get('creatorBase');
          var opponentHp = game.get('opponentBase');
          if (opponentHp === 0 || creatorHp === 0) {
            // someone lost

            // if opponent lost and you are the creator
            if ( (opponentHp === 0 && thisIsCreator) || (creatorHp === 0 && !thisIsCreator)) {
              // YOU WIN
              Ember.Logger.info('You win!', 'thisIsCreator: ', thisIsCreator );

            } else {
              Ember.Logger.info('You Lost!', 'thisIsCreator: ', thisIsCreator );
              // if creator lost and you are the creator
              // YOU LOST
            }

          }

          /////////////////////

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

          if (game.get('turn') === username) {
            return  game.save();
          } else {
            return Ember.RSVP.resolve();
          }
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
      this.controllerFor('game').set('lastSelectedCard', card.get('id'))
    },

    // Call to set a specific board position
    setBoard: function(pos) {
      var gameCtrl = this.controllerFor('game')
      var username = this.controllerFor('navbar').get('username')
      var card = gameCtrl.get('lastSelectedCard')

      // Not your turn or no selected card
      if (gameCtrl.get('turn') !== username || !card) return

      var id = gameCtrl.get('id')
      if (id) {
        Ember.Logger.info('Save card to ctrl/db: ', pos, card)
        this.store.find('game', id).then((game) => {
          gameCtrl.set(pos, card)
          game.set(pos, card)
          // set card HP into db as well.
          // convert position key to an hp key
          var hpKey = 'hp' + pos.slice(5)
          game.set(hpKey, 4);


          return game.save()
        })
      }
    },
    // Player attacked a base in the view.
    attackBase: function() {
      Ember.Logger.info('Calling attackBase');

      var gameCtrl = this.controllerFor('game')
      var username = this.controllerFor('navbar').get('username')

      var id = gameCtrl.get('id')
      if (id) {

        this.store.find('game', id).then((game) => {
          Ember.Logger.info('Found Game', game);

          if (username === id) {
            var curHp = game.get('opponentBase');
            game.set('opponentBase', curHp--);

          } else {
            var curHp = game.get('creatorBase');
            game.set('creatorBase', curHp--);
          }

          return game.save()
        })
      } else {
        Ember.Logger.warn('No Game Found');
      }
    },



  }
});
