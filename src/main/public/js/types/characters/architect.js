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
    initialize : function (attributes, options) {
      
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
      
      // Set the abilities with their defaults
      // TODO: Class abilities added based on a person's experience
      var that = this;
      this.abilities = [
        // Ability 1: Build Wall
        function () {
          if (!that.cooldowns[0]) {
            that.cooldowns[0] = 10;
            var wall = ktah.scene.getSceneNodeFromName('wall').createClone(ktah.scene.getRootSceneNode());
            // TODO: Fix the maffs on the wall building
            wall.Rot.Y = that.sceneNode.Rot.Y + 270;
            wall.Pos.X = that.sceneNode.Pos.X + 10 * Math.cos(wall.Rot.Y);
            wall.Pos.Y = that.sceneNode.Pos.Y + 15;
            wall.Pos.Z = that.sceneNode.Pos.Z + 10 * Math.sin(wall.Rot.Y);
            wall.Scale.Y = 4;
            wall.Scale.Z = 5;
            // TODO: Post wall to gamestate
            that.cooldowns[0] = 10;
            //that.tickCooldown(0, wall);
            return "used";
          }
          return that.cooldowns[0];
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
      
      this.cooldowns = [0, 0, 0, 0, 0];
      
      this.tickCooldown = function (cooldownNumber, sceneNode) {
        var currentCooldown = that.cooldowns[cooldownNumber];
        if (currentCooldown > 0) {
          currentCooldown--;
          setTimeout(that.tickCooldown(cooldownNumber, sceneNode), 1000);
        } else {
          ktah.scene.getRootSceneNode().removeChild(sceneNode);
        }
      }
    }
  });
});