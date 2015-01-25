import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['navbar', 'index', 'application'],
  username: Ember.computed.alias('controllers.navbar.username'),
  cards: Ember.computed.alias('controllers.index.library'),
  gh: Ember.computed.alias('controllers.application.gh'),
  Card: Ember.computed.alias('controllers.index.Card'),

  // id of the game we are playing
  id: null,

  // Last selected card
  lastSelectedCard: null,
  lookupCard: function(id) {
    if (!id) return Ember.RSVP.reject()
    var card = this.get('cards').findBy('id', id)
    if (card) return Ember.RSVP.resolve(card)
    var gh = this.get('gh')
    var Card = this.get('Card')
    return gh('repos/' + id).then((repo) => {
      Ember.Logger.info('Could not find card in library, looked up on gh: ', repo)
      return Card.create(repo)
    })
  },

  // name of your opponent
  opponent: null,
  opponentAvatarUrl: null,

  // Whether this player is the opponent or not
  isOpponent: Ember.computed('id', 'username', function() {
    Ember.Logger.info('wtf is this? ', this.get('id'), this.get('username'))
    return !!(this.get('id') === this.get('username'))
  }),

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
