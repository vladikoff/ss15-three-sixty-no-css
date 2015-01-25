/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  hinting: false
});
app.import('bower_components/band.js/dist/band.js');
app.import('bower_components/firebase/firebase.js');
app.import('bower_components/emberfire/dist/emberfire.js');
app.import('vendor/Three.js');
app.import('vendor/cannon.js');
app.import('vendor/TrackballControls.js');
app.import('vendor/Detector.js');
app.import('vendor/moment.js');
app.import('vendor/tweenjs.js');

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
