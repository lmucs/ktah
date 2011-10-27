/**
 * monster.js
 *
 * Contains general monster attributes between classes.
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