/**
 * chemist.js
 *
 * The type of "chemist" containing class attributes.
 *
 * The chemist employs the widest variety of resources
 * to fuel his abilities, which can range from augmenting 
 * an architect's wall to creating pacifying concoctions
 * to provide emergency relief from the horde.
 *
 */

$(function () {
  ktah.types.Chemist = ktah.types.Character.extend({
    initialize: function (attributes, options) {
      // do what we need to do whenever we create an Architect
      this.resources = {
        stone: 0,
        wood: 0,
        water: 0,
        zombieFlesh: 0,
        atomicWaste: 0
      }
      
      this.sceneNode = options.sceneNode.createClone(ktah.scene.getRootSceneNode());
      
    }
  });
});