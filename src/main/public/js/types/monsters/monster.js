/**
 * monster.js
 *
 * The abstract type of all monsters.
 */

$(function () {
  ktah.types.Monster = Backbone.Model.extend({
    defaults: {
      type: 'monster',
      id: null,
      health: 100,
      posX: 0,
      posZ: 0
    }
  });
});
