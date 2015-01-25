import DS from 'ember-data';

export default DS.Model.extend({
  opponent: DS.attr('string', { defaultValue: '' }),
  createdAt: DS.attr('number', { defaultValue: function() { return moment().utc() } }),
  turn: DS.attr('string', { defaultValue: '' }),
  lastTurnSwitch: DS.attr('number', { defaultValue: function() { return moment().utc() } }),
  // Board Configuration
  // Creator is the ID, aka the HOST
  boardCreatorL1: DS.attr('string'),
  boardCreatorL2: DS.attr('string'),
  boardCreatorC1: DS.attr('string'),
  boardCreatorC2: DS.attr('string'),
  boardCreatorR1: DS.attr('string'),
  boardCreatorR2: DS.attr('string'),
  // Opponents board
  boardOpponentL1: DS.attr('string'),
  boardOpponentL2: DS.attr('string'),
  boardOpponentC1: DS.attr('string'),
  boardOpponentC2: DS.attr('string'),
  boardOpponentR1: DS.attr('string'),
  boardOpponentR2: DS.attr('string'),
  creatorHealth: 10,
  opponentHealth: 10
});
