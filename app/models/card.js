import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  starred_count: DS.attr('number'),
  watchers_count: DS.attr('number'),
  user: DS.belongsTo('user'),
});
