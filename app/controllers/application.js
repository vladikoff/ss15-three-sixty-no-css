import Ember from 'ember';

var ApplicationController = Ember.Controller.extend({
  ghToken: Ember.computed(function(key, val) {
    // Save to local storage?
    return val
  }),
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
  }
});

export default ApplicationController;
