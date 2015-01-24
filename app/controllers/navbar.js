import Ember from 'ember';

export default Ember.Controller.extend({
  user: null,
  username: Ember.computed('user.login', function() {
    return this.get('user.login')
  }),
  avatar: Ember.computed('user.avatar_url', function() {
    return this.get('user.avatar_url');
  })
});
