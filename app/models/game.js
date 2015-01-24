import DS from 'ember-data';

export default DS.Model.extend({
  opponent: DS.attr('string', { defaultValue: '' }),
  createdAt: DS.attr('date', { defaultValue: function() { return new Date() } }),
  turn: DS.attr('string', { defaultValue: '' }),
});
