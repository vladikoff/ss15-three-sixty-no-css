import DS from 'ember-data';

export default DS.Model.extend({
  opponent: DS.attr('string', { defaultValue: '' }),
  createdAt: DS.attr('number', { defaultValue: function() { return moment().utc() } }),
  turn: DS.attr('string', { defaultValue: '' }),
  lastTurnSwitch: DS.attr('number', { defaultValue: function() { return moment().utc() } }),
});
