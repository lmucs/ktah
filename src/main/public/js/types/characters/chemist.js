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
        zombieFlesh: 0,
        atomicWaste: 0,
        expertise: 0
      }
      
      this.sceneNode = options.sceneNode.createClone(ktah.scene.getRootSceneNode());
      this.characterClass = "chemist";
      
      // Set the abilities with their defaults
      this.abilities = [];
      for (var i = 0; i < 5; i++) {
        this.abilities[i] = function () {
          return false;
        }
      }
      
      // TODO: Class abilities added based on a person's experience
      var that = this;
      this.abilities = [
        function () {
        },
        
        function () {
        },
        
        function () {
        },
        
        function () {
        },
        
        function () {
        }
      ];
    }
  });
});