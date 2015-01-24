import DS from 'ember-data';

export default DS.Model.extend({
  opponent: DS.attr('string'),
  createdAt: DS.attr('date')
});
