import DS from 'ember-data';

export default DS.Model.extend({
  opponent: DS.attr('string', { defaultValue: '' }),
  createdAt: DS.attr('number', { defaultValue: function() { return moment().utc() } }),
  turn: DS.attr('string', { defaultValue: '' }),
  lastTurnSwitch: DS.attr('number', { defaultValue: function() { return moment().utc() } }),
  // Board Configuration
  // Creator is the ID, aka the HOST
  boardCreatorL1: DS.attr('string', { defaultValue: '' }),
  boardCreatorL2: DS.attr('string', { defaultValue: '' }),
  boardCreatorC1: DS.attr('string', { defaultValue: '' }),
  boardCreatorC2: DS.attr('string', { defaultValue: '' }),
  boardCreatorR1: DS.attr('string', { defaultValue: '' }),
  boardCreatorR2: DS.attr('string', { defaultValue: '' }),
  // Opponents board
  boardOpponentL1: DS.attr('string', { defaultValue: '' }),
  boardOpponentL2: DS.attr('string', { defaultValue: '' }),
  boardOpponentC1: DS.attr('string', { defaultValue: '' }),
  boardOpponentC2: DS.attr('string', { defaultValue: '' }),
  boardOpponentR1: DS.attr('string', { defaultValue: '' }),
  boardOpponentR2: DS.attr('string', { defaultValue: '' }),
  creatorHealth: 10,
  opponentHealth: 10
});
