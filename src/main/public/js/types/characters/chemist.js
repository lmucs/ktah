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
        // Ability 1: Build Wall
        function () {
          var playerPosition = that.sceneNode.Pos,
              abilityNumber = 0,
              cooldown = 10;
          if (!that.cooldowns[abilityNumber]) {
            ktah.abilities.postAbilityUse("chemical", playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
            that.cooldowns[abilityNumber] = cooldown;
            that.fadeAbilities(abilityNumber, cooldown);
            that.tickCooldown(abilityNumber);
            // Ability point bonus
            ktah.util.queuedPoints += 10;
            return -1;
          }
          return that.cooldowns[abilityNumber];
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
      
      this.tickCooldown = function (cooldownNumber) {
        var currentCooldown = that.cooldowns[cooldownNumber];
        if (currentCooldown > 0) {
          setTimeout(function () {
            that.cooldowns[cooldownNumber]--;
            that.tickCooldown(cooldownNumber);
            }, 1000);
        } else {
          that.cooldowns[cooldownNumber] = 0;
        }
      }
    }
  });
});