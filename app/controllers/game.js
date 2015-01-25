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
});
