import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['small-card'],
  classNameBindings: ['selected'],
  data: null,
  selected: false,
  click: function(e) {
    this.toggleProperty('selected');
    this.sendAction('action', this.data);
  },
  mouseEnter: function(e) {
    this.sendAction('showCurrent', this.data);
  }
});
