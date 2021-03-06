import Ember from 'ember';

export default Ember.Mixin.create({
  needs: ['application'],
  ghToken: Ember.computed.alias('controllers.application.ghToken'),
  gh: function (api) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: 'https://api.github.com/' + api,
        type: 'GET',
        dataType: 'json',
        success: resolve,
        error: function(xhr, status, err) {
          reject(err)
        },
        beforeSend: (xhr) => {
          // Why doesnt this work? Its needed for the GH API. Not really actually.
          //xhr.setRequestHeader('User-Agent', 'Super App')
          xhr.setRequestHeader('Authorization', 'token ' + this.get('ghToken'))
        },
      })
    })
  },
});
