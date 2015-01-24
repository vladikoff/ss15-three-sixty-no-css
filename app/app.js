import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

var conductor = new BandJS();
conductor.setTimeSignature(4,4);
conductor.setTempo(120);
var piano = conductor.createInstrument();
piano.note('quarter', 'F4');
var player = conductor.finish();
player.play();

loadInitializers(App, config.modulePrefix);

export default App;
