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
            this.store.createRecord('user', user);
            this.controllerFor('navbar').set('user', user);
            this.send('gatherStarred');
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
      //this.transitionTo('game');
      var username = this.controllerFor('navbar').get('username')

      // This player is now available
      var game = this.store.createRecord('game', {
        id: username,
        opponent: '',
      })

      game.save().then(() => {
        return this.store.findAll('game')
      }).then((data) => {
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

        // Couldnt find a game
        if (!foundGame) {
          throw new Error('Could not find a game')
        }

        // Found game, set opponent
        var opponent = foundGame.get('id')
        game.set('opponent', opponent)
        return game.save().then((g) => {
          return this.store.find('game', opponent).then((otherGame) => {
            otherGame.set('opponent', username)
            return otherGame.save()
          }).then(() => {
            return g
          })
        })
      }).then((g)=> {
        // TODO: START A FLIPPIN GAME
        console.log('start game against', g.get('opponent'))
      })
      .catch((err) => {
        // TODO: Do something with this
        throw err;
      });
    },
    logout: function () {
      location.reload();
    },
  },
});
