/**
 * monster.js
 *
 * Contains general basicZombie attributes and functions.
 */

$(function () {
    ktah.types.BasicZombie = ktah.types.Monster.extend({
      initialize: function() {
        alert("you created a zombie!");
      }
    });
});