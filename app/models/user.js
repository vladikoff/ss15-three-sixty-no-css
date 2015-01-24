import Ember from 'ember';

export default DS.Model.extend({
  cards: DS.hasMany('card'),
  createdAt: DS.attr('date', { defaultValue: function() { return new Date() } }),
  hp: DS.attr('number'),
});
