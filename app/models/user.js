import Ember from 'ember';

export default DS.Model.extend({
  cards: DS.hasMany('card'),
});
