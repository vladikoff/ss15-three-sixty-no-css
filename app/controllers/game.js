import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['navbar'],
  username: Ember.computed.alias('controllers.navbar.username'),

  // id of the game we are playing
  id: null,

  // name of your opponent
  opponent: null,
  opponentAvatarUrl: null,

  // Whether this player is the opponent or not
  isOpponent: false,

  // Did the opponent probably leave?
  opponentProbablyLeft: false,

  deck: null,

  // How many seconds until this turn ends
  clock: 0,

  // Whose turn is it?
  turn: '',
  isMyTurn: Ember.computed('turn', function() {
    return !!(this.get('turn') === this.get('username'))
  }),

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
