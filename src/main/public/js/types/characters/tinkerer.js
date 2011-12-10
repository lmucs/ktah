/**
 * tinker.js
 *
 * The type of "tinker" containing class attributes.
 *
 * The tinker "excels" in a variety of abilities that may greatly
 * aid or hinder his team and their abilities. Aside from most of 
 * his abilities relying on a toss of the dice, he is the only class
 * capable of consistently chipping away at members of the horde,
 * able to disable the occasional member for an entire round.
 *
 */

$(function () {
  ktah.types.Tinkerer = ktah.types.Character.extend({
    initialize: function (attributes, options) {
      // do what we need to do whenever we create an Architect
      this.resources = {
        stone: 0,
        wood: 0,
        atomicWaste: 0,
        expertise: 0
      }
      
      this.sceneNode = options.sceneNode.createClone(ktah.scene.getRootSceneNode());
      this.characterClass = "tinkerer";
      
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