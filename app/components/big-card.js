import Ember from 'ember';
import util from '../helpers/3d/util';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['big-card'],
  classNameBindings: ['selected'],
  data: null,
  selected: false,
  click: function(e) {

    var cardData = this.get('data');
    // if the component is used in the game then we need to perform an action, TODO: MOVE THIS?
    var inGame = window.location.pathname.indexOf('game') > -1;
    if (inGame) {
      window.CURRENT_CARD = cardData;
    } else {
      SOUNDTRACK.select();
    }
    this.sendAction('action', this.get('data'))
    this.toggleProperty('selected');
  },
});
