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
        stone: 0,
        learningExp: 0,
        expertise: 0
      }
      
      this.sceneNode = options.sceneNode.createClone(ktah.scene.getRootSceneNode());
      this.characterClass = "pioneer";
      
      // Set the abilities with their defaults
      this.abilities = [];
      for (var i = 0; i < 5; i++) {
        this.abilities[i] = function () {
          return false;
        }
      }
      
      // Bootleg way of making abilities look available
      this.availableAbilities = [
        "abilityIconHere",
        "abilityIconHere",
        null,
        null,
        null
      ];
      
      // TODO: Class abilities added based on a person's experience
      var that = this;
      this.abilities = [
        function () {
          var playerPosition = that.sceneNode.Pos,
              abilityNumber = 0,
              cooldown = 2;
          if (!that.cooldowns[abilityNumber]) {
            ktah.abilities.postAbilityUse("path", that.id, playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
            that.cooldowns[abilityNumber] = 2;
            that.fadeAbilities(abilityNumber, cooldown);
            that.tickCooldown(abilityNumber);
            // Ability point bonus
            ktah.util.queuedPoints += 3;
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