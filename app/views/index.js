import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    this._super()
    console.log('im inside yer app')
  }
});
