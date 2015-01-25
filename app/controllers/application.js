import Ember from 'ember';

export default Ember.Controller.extend({
  makeRequest: function(url) {
    return Ember.$.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      beforeSend: (xhr) => {
        // Why doesnt this work? Its needed for the GH API. Not really actually.
        //xhr.setRequestHeader('User-Agent', 'Super App')
        xhr.setRequestHeader('Authorization', 'token ' + window._JRR_TOLKIEN)
      },
    }).then(function(resp, status, jqXHR) {
      var linkHeader = jqXHR.getResponseHeader('Link');
      return { data: resp, link: linkHeader };
    });
  },

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
          xhr.setRequestHeader('Authorization', 'token ' + window._JRR_TOLKIEN)
        },
      })
    })
  },

  gh2: function (api, fullResponse, shouldCache) {
    // Get the first page from GitHub
    var url = 'https://api.github.com/' + api;

    var parseResponse = function(resp) {
      var next = null;

      if (resp.link) {
        var parts = resp.link
          .split(", ")
          .map((a) => { return a.split("; ") });

        if (parts[0][0] !== parts[1][0]) {
          next = parts[0][0].slice(1, -1);
        }
      }

      // Join data.
      if (Array.isArray(fullResponse)) {
        fullResponse.push.apply(fullResponse, resp.data);
      }
      else {
        fullResponse = resp.data;
      }

      if (next) {
        return this.makeRequest(next).then(parseResponse);
      }

      if (shouldCache) {
        sessionStorage[api] = JSON.stringify(fullResponse);
      }

      return fullResponse;
    }.bind(this);

    if (shouldCache && sessionStorage[api]) {
      return new Promise(function(resolve) {
        resolve(JSON.parse(sessionStorage[api]));
      });
    }

    return this.makeRequest(url).then(parseResponse);
  }
});
