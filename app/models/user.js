import Ember from 'ember';

export default DS.Model.extend({
  cards: DS.hasMany('card'),
  createdAt: DS.attr('number', { defaultValue: function() { return moment().utc() } }),
  hp: DS.attr('number'),
});
