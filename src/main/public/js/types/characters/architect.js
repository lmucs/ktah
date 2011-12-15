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
        expertise: 0
      }
      
      this.sceneNode = options.sceneNode.createClone(ktah.scene.getRootSceneNode());
      this.characterClass = "architect";
      
      // Set the abilities with their defaults
      // TODO: Class abilities added based on a person's experience
      var that = this;
      this.abilities = [
        // Ability 1: Build Wall
        function () {
          var playerPosition = that.sceneNode.Pos,
              abilityNumber = 0,
              cooldown = 5;
          if (!that.cooldowns[abilityNumber]) {
            ktah.abilities.postAbilityUse("mud", that.id, playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
            that.cooldowns[abilityNumber] = cooldown;
            that.fadeAbilities(abilityNumber, cooldown);
            that.tickCooldown(abilityNumber);
            // Ability point bonus
            ktah.util.queuedPoints += 5;
            return -1;
          }
          return that.cooldowns[abilityNumber];
        },
        
        function () {
          var playerPosition = that.sceneNode.Pos,
          abilityNumber = 1,
          cooldown = 10;
          if (!that.cooldowns[abilityNumber]) {
            ktah.abilities.postAbilityUse("woodWall", that.id, playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
            that.cooldowns[abilityNumber] = cooldown;
            that.fadeAbilities(abilityNumber, cooldown);
            that.tickCooldown(abilityNumber);
            // Ability point bonus
            ktah.util.queuedPoints += 1;
            return -1;
          }
          return that.cooldowns[abilityNumber];
        },
        
        function () {
            var playerPosition = that.sceneNode.Pos,
            abilityNumber = 2,
            cooldown = 20;
            if (!that.cooldowns[abilityNumber]) {
              ktah.abilities.postAbilityUse("stoneWall", that.id, playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
              that.cooldowns[abilityNumber] = cooldown;
              that.fadeAbilities(abilityNumber, cooldown);
              that.tickCooldown(abilityNumber);
              // Ability point bonus
              ktah.util.queuedPoints += 1;
              return -1;
            }
            return that.cooldowns[abilityNumber];
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