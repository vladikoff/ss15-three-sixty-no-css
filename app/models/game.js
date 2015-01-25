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
  // CARD HP STATE
  hpCreatorL1: DS.attr('number', { defaultValue: 0 }),
  hpCreatorL2: DS.attr('number', { defaultValue: 0 }),

  hpCreatorC1: DS.attr('number', { defaultValue: 0 }),
  hpCreatorC2: DS.attr('number', { defaultValue: 0 }),

  hpCreatorR1: DS.attr('number', { defaultValue: 0 }),
  hpCreatorR2: DS.attr('number', { defaultValue: 0 }),

  hpOpponentL1: DS.attr('number', { defaultValue: 0 }),
  hpOpponentL2: DS.attr('number', { defaultValue: 0 }),

  hpOpponentC1: DS.attr('number', { defaultValue: 0 }),
  hpOpponentC2: DS.attr('number', { defaultValue: 0 }),

  hpOpponentR1: DS.attr('number', { defaultValue: 0 }),
  hpOpponentR2: DS.attr('number', { defaultValue: 0 }),


  creatorHealth: DS.attr('number', { defaultValue: function() { return 10 } }),
  opponentHealth: DS.attr('number', { defaultValue: function() { return 10 } })
});
