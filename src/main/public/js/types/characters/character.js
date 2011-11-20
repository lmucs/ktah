/**
 * charClass.js
 *
 * Contains general character attributes between classes.
 * 
 */

$(function () {
  ktah.types.Character = Backbone.Model.extend({
    defaults: {
      
      // Public properties
      name: "",
      characterClass: null,
      id: null,
      level: 1,
      health: 100, // TODO: Arbitrary placeholder
      sceneNode: null
    }
  });
});