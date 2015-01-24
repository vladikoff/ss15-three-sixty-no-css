import Ember from 'ember';

var ApplicationController = Ember.Controller.extend({
  ghToken: Ember.computed(function(key, val) {
    // Save to local storage?
    return val
  }),
  gh: function (api) {
    var url = 'https://api.github.com/' + api
    return Ember.$.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      beforeSend: (xhr) => {
        // Why doesnt this work? Its needed for the GH API
        //xhr.setRequestHeader('User-Agent', 'Super App')
        xhr.setRequestHeader('Authorization', 'token ' + this.get('ghToken'))
      },
    })
  }
});

export default ApplicationController;
