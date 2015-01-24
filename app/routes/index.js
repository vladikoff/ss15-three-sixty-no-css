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
      var deck = this.controllerFor('index').get('deck')
      this.controllerFor('application').gh('users/' + username + '/starred').then((stars) =>{
        stars.forEach((star) =>{
          star.id = star.full_name;
          star.user = this.store.find('user', username);
          this.store.createRecord('card', star);
          library.pushObject(Card.create(star))
        });

        library.forEach(function (card) {
          if (deck.length < 8) {
            deck.pushObject(card)
          }
        });
      })
    },
    findMatch: function () {
      this.transitionTo('game');
      // find all lobbies
      // join a lobby with 1 player
      /*this.store.findAll('game').then((data) => {
        var foundGame = false;
        var content = data.get('content');
        Ember.Logger.info('Available games:');
        Ember.Logger.info(content);


        if (content.length > 0) {
        // if there is a player to match with
          content.forEach(function (game) {
            var op = game.get('opponent');

            Ember.Logger.info(op);
          });
        }

        if (!foundGame) {
          // if no lobbies found then make a new lobby
          var lobby = this.store.createRecord('game', {
            id: 'vladikoff',
            createdAt: new Date(),
            opponent: 'test'
          });

          lobby.save();
          Ember.Logger.info('Created a game');
        }


      });
*/
    },
    logout: function () {
      alert('NOT IMPLEMENTED');
    },
  },
});
