/**
 * architect.js
 *
 * The type of "architect" containing class attributes.
 *
 * The architect specializes in constructing static defenses
 * against the thundering horde, giving team mates time to 
 * prepare their abilities and recover from rushes.
 *
 */

$(function () {
  ktah.types.Architect = ktah.types.Character.extend({
    initialize: function (attributes, options) {
      
      // do what we need to do whenever we create an Architect
      this.resources = {
        stone: 0,
        wood: 0,
        scrapMetal: 0,
        sand: 0,
        atomicWaste: 0
      }
      
      this.sceneNode = options.sceneNode.createClone(ktah.scene.getRootSceneNode());
      this.characterClass = "architect";

    }
  });
});