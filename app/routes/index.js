import Ember from 'ember';
import config from '../models/game';

export default Ember.Route.extend({
  model: function() {
    return this.store.findAll('game').then((games) => {
      this.controllerFor('index').set('activeGames', games.get('content').length)
    })
  },
  actions: {
    login: function () {
      var ref = new Firebase("https://dazzling-heat-4787.firebaseio.com");
      ref.authWithOAuthPopup("github", (error, authData) => {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          var username = authData.github.username;
          window._JRR_TOLKIEN = authData.github.accessToken;
          //this.controllerFor('application').set('ghToken', authData.github.accessToken);
          console.log("Authenticated successfully with payload:", authData);
          this.controllerFor('application').gh('users/' + username).then((user) =>{
            user.id = user.login;
            this.store.createRecord('user', user).save().then(() => {
              this.controllerFor('navbar').set('user', user);
              this.send('gatherStarred');
            });
          });
        }
      });
    },
    gatherStarred: function() {
      var username = this.controllerFor('navbar').get('username')
      var Card = this.controllerFor('index').get('Card')
      var library = this.controllerFor('index').get('library')
      var deck = this.controllerFor('index').get('deck') // TODO: MOVE THIS??

      this.controllerFor('application').gh('users/' + username + '/starred').then((stars) =>{
        stars.forEach((star) =>{
          star.id = star.full_name;
          star.user = this.store.find('user', username);
          this.store.createRecord('card', star);
          library.pushObject(Card.create(star))
        });

        // Get first 8 cards for a deck
        var deck = library.splice(0, 8)
        this.controllerFor('game').set('deck', deck);
      })
    },
    findMatch: function () {
      SOUNDTRACK.startSomething();
      var username = this.controllerFor('navbar').get('username');

      // If you already had an abandoned game
      this.store.find('game', username).then((game) => {
        return game.destroyRecord()
      }).catch((err) => {
        // no existing game, continue
        return Ember.RSVP.resolve()
      }).then(() => {
        this.store.unloadAll('game');

        return this.store.findAll('game')
      }).then((data) => {
        Ember.Logger.info('Finding open Games');
        // Find open games
        var content = data.get('content')

        var foundGame = content.reduce((cur, next) => {
          Ember.Logger.info('Reducing with:', next.get('opponent'), username);
          if (cur === false) {
            // Cant play against yourself
            if (username === next.get('id')) return false
            // If player is already player but not yourself
            if (next.get('opponent') === '') {
              return next
            } else {
              return false
            }

          } else {
            return cur
          }
        }, false)

        // Couldnt find a game, make the player available to others
        if (!foundGame) {
          return this.store.createRecord('game', { id: username }).save().then(() => {
            this.controllerFor('index').set('waitingForGame', true);
            this.send('waitForMatch')
          })
        }

        // Found game, set this user as opponent and their turn then start game
        foundGame.set('opponent', username)
        foundGame.set('turn', username)
        return foundGame.save().then(() => {
          Ember.Logger.info('Starting a game with: ', foundGame.get('id'))
          this.controllerFor('game').set('id', foundGame.get('id'))
          this.transitionTo('game')
        })
      })
      .catch((err) => {
        // TODO: Do something with this
        throw err;
      });
    },
    waitForMatch: function() {
      var username = this.controllerFor('navbar').get('username');
      Ember.Logger.info('Waiting for a game... with username: ', username);
      this.store.find('game', username).then((g) => {
        // You have an opponent now
        if (g.get('opponent') !== '') {
          Ember.Logger.info('Found a game after waiting! Starting game with: ', g.get('opponent'));
          this.controllerFor('game').set('id', username)
          return this.transitionTo('game')
        }
        // No game found, keep polling
        Ember.run.later(() => {
          this.send('waitForMatch')
        }, 1000)
      });
    },
    cancel: function() {
      var username = this.controllerFor('navbar').get('username');
      this.store.find('game', username).then((game) => {
        return game.destroyRecord()
      }).catch(() => {
        return Ember.RSVP.resolve()
      }).finally(() => {
        this.controllerFor('index').set('waitingForGame', false)
      })
    },

    // Select deselect cards
    select: function(card) {
      this.controllerFor('game').get('deck').pushObject(card)
    },
    deselect: function(card) {
      this.controllerFor('game').get('deck').removeObject(card)
    },
    setCurrent: function() {
      console.log(arguments);
    },
  },
});
