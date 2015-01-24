import Ember from 'ember';

export default Ember.Controller.extend({
  user: null,
  username: Ember.computed('user.login', function() {
    return this.get('user.login')
  }),
});
