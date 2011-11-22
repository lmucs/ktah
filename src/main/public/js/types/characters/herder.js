/**
 * herder.js
 *
 * The type of "herder" containing class attributes.
 *
 * Acting in an atypically synergistic fashion with the 
 * horde, the herder serves to mislead and manipulate 
 * zombies so that other team mates have time to gather 
 * resources and perform abilities.
 *
 */

$(function () {
  ktah.types.Herder = ktah.types.Character.extend({
    initialize: function (attributes, options) {
      // do what we need to do whenever we create an Architect
      this.resources = {
        zombieFlesh: 0,
        atomicWaste: 0
      }
      
      this.sceneNode = options.sceneNode.createClone(ktah.scene.getRootSceneNode());
      this.characterClass = "herder";
      
      // Set the abilities with their defaults
      this.abilities = [];
      for (var i = 0; i < 5; i++) {
        this.abilities[i] = function () {
          return false;
        }
      }
      
      // TODO: Class abilities added based on a person's experience
    }
  });
});