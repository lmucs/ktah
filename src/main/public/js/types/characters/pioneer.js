/**
 * pioneer.js
 *
 * The type of pioneers containing class attributes.
 * 
 * The pioneer acts as a guide and master of exploration.
 * More often away from the group than working closely to it, 
 * he will find resources that fuel class abilities and hideouts 
 * that temporarily obscure the group from detection.
 */

$(function () {
  ktah.types.Pioneer = ktah.types.Character.extend({
    initialize: function (attributes, options) {
      // do what we need to do whenever we create an Architect
      this.resources = {
        wood: 0,
        water: 0,
        learningExp: 0
      }
      
      this.sceneNode = options.sceneNode.createClone(ktah.scene.getRootSceneNode());
      this.characterClass = "pioneer";
      
    }
  });
});