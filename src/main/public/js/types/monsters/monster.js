/**
 * monster.js
 *
 * Contains general monster attributes between classes.
 */

$(function () {
    ktah.types.Monster = Backbone.Model.extend({
      defaults: {
        id: null,
        health: 100,
        posx: 0,
        posy: 0
      }
    });
});