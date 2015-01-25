import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['cards', 'deck-list'],
  data: null,

  maxCards: 5,

  wrapSortable: function() {
    Sortable.create(this.element.querySelector('ul'));
  }.on('didInsertElement'),

  actions: {
    showCurrent: function(data) {
      this.sendAction('showCurrent', data);
    },

    addToDeck: function(data) {
      this.sendAction('addToDeck', data, this.get('maxCards'));
    },

    removeFromDeck: function(data) {
      this.sendAction('removeFromDeck', data);
    }
  }
});
