import Ember from 'ember';
import config from '../models/game';

export default Ember.Route.extend({
  actions: {
    login: function () {
      var ref = new Firebase("https://dazzling-heat-4787.firebaseio.com");
      ref.authWithOAuthPopup("github", (error, authData) => {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          var username = authData.github.username;
          this.controllerFor('application').set('ghToken', authData.github.accessToken);
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
        var deck = library.slice(0, 8)
        this.controllerFor('game').set('deck', deck);
      })
    },
    findMatch: function () {
      var username = this.controllerFor('navbar').get('username');

      // Find open games
      this.store.findAll('game').then((data) => {
        var foundGame = data.get('content').reduce((cur, next) => {
          if (cur === false) {
            // Cant play against yourself
            if (username === next.get('id')) return false
            // If player is already player but not yourself
            if (next.get('opponent') !== '' && next.get('opponent') !== username) return false
            return next
          } else {
            return cur
          }
        }, false)

        // Couldnt find a game, make the player available to others
        if (!foundGame) {
          return this.store.createRecord('game', { id: username }).save().then(() => {
            this.send('waitForMatch')
          })
        }

        // Found game, set this user as opponent and start game
        foundGame.set('opponent', username)
        return foundGame.save().then(() => {
          Ember.Logger.info('Starting a game with: ', foundGame.get('id'))
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
      Ember.Logger.info('Waiting for a game...');
      this.store.find('game', username).then((g) => {
        // You have an opponent now
        if (g.get('opponent') !== '') {
          Ember.Logger.info('Found a game after waiting! Starting game with: ', g.get('opponent'));
          return this.transitionTo('game')
        }
        // No game found, keep polling
        Ember.run.later(() => {
          this.send('waitForMatch')
        }, 1000)
      });
    },
    logout: function () {
      location.reload();
    },
  },
});
