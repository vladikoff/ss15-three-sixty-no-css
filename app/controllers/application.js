import Ember from 'ember';
import GHMixin from '../mixins/gh';

export default Ember.Controller.extend(GHMixin, {
  ghToken: Ember.computed(function(key, val) {
    // Save to local storage?
    return val
  })
});
