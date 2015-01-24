import Ember from 'ember';

var IndexView = Ember.View.extend({
  didInsertElement: function() {
    this._super()
    console.log('im inside yer app')
  }
});

export default IndexView;
