import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['card'],
  classNameBindings: ['selected'],
  data: null,
  selected: false,
  click: function(e) {
    this.toggleProperty('selected');
  },
});
