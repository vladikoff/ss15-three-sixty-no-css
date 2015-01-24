import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    login: function () {
      var ref = new Firebase("https://dazzling-heat-4787.firebaseio.com");
      ref.authWithOAuthPopup("github", (error, authData) => {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          this.controllerFor('application').set('ghToken', authData.token);
          console.log("Authenticated successfully with payload:", authData);

          this.controllerFor('application').gh('users/shama').then(function(data) {
            console.log('gh data', data)
          }).catch(function() {
            console.log('nope')
          })
        }
      });
    }
  },
});
