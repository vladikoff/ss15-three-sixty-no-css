import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    login: function () {
      var ref = new Firebase("https://dazzling-heat-4787.firebaseio.com");
      ref.authWithOAuthPopup("github", (error, authData) => {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          this.controllerFor('application').set('ghToken', authData.github.accessToken);
          console.log("Authenticated successfully with payload:", authData);
          this.controllerFor('application').gh('users/shama').then((data) =>{
            this.controllerFor('navbar').set('username', data.login)
          }).catch(function() {
            console.log('nope')
          })
        }
      });
    }
  },
});
