import Ember from 'ember';

export default Ember.Controller.extend({
  // id of the game we are playing
  id: null,

  // name of your opponent
  opponent: null,

  deck: null,

  // How many seconds until this turn ends
  clock: 0,

  // Whose turn is it?
  // false = Not yours, true = your turn
  turn: false,

  // Example on how to know when turns have switched
  onTurnSwitch: Ember.observer('turn', function() {
    var myTurn = this.get('turn')
    //Ember.Logger.info('It is ' + myTurn + ' your turn')
  })
});
