import Ember from 'ember';

export default Ember.Controller.extend({
  // id of the game we are playing
  id: null,

  // name of your opponent
  opponent: null,

  // Did the opponent probably leave?
  opponentProbablyLeft: false,

  deck: null,
  map: {
    my0: null,
    my1: null,
    my2: null,
    my3: null,
    my4: null,
    my5: null,
    opponent0: null,
    opponent1: null,
    opponent2: null,
    opponent3: null,
    opponent4: null,
    opponent5: null
  },

  // How many seconds until this turn ends
  clock: 0,

  // Whose turn is it?
  // false = Not yours, true = your turn
  turn: false,
});
