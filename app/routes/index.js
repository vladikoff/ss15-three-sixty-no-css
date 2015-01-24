import Ember from 'ember';

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
      this.controllerFor('application').gh('users/' + username + '/starred').then((stars) =>{
        stars.forEach((star) =>{
          star.id = star.full_name;
          star.user = this.store.find('user', username);
          this.store.createRecord('card', star);
          library.pushObject(Card.create(star))
        });
      })
    },
  },
});
