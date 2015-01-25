import Ember from 'ember';

export default Ember.Controller.extend({
  // id of the game we are playing
  id: null,

  // name of your opponent
  opponent: null,
  opponentAvatarUrl: null,

  // Did the opponent probably leave?
  opponentProbablyLeft: false,

  deck: null,

  // How many seconds until this turn ends
  clock: 0,

  // Whose turn is it?
  // false = Not yours, true = your turn
  turn: false,

  // game board positions
  boardKeys: [
    'boardCreatorL1',
    'boardCreatorL2',
    'boardCreatorC1',
    'boardCreatorC2',
    'boardCreatorR1',
    'boardCreatorR2',
    'boardOpponentL1',
    'boardOpponentL2',
    'boardOpponentC1',
    'boardOpponentC2',
    'boardOpponentR1',
    'boardOpponentR2',
  ],

  creatorHealth: 10,
  opponentHealth: 10,
});
