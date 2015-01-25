import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['cards', 'deck-list'],
  data: null,
  wrapSortable: function() {
    // Make the list sortable ya know?
    Sortable.create(this.element);
  }.on('didInsertElement'),

  actions: {
    showCurrent: function(data) {
      this.sendAction('showCurrent', data);
    }
  }
});

