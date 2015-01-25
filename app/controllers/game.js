import Ember from 'ember';
import GHMixin from '../mixins/gh';

export default Ember.Controller.extend(GHMixin, {
  // id of the game we are playing
  id: null,

  // name of your opponent
  opponent: null,

  // Did the opponent probably leave?
  opponentProbablyLeft: false,

  deck: null,

  // How many seconds until this turn ends
  clock: 0,

  // Whose turn is it?
  // false = Not yours, true = your turn
  turn: false,
});
