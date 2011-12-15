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
        atomicWaste: 0,
        expertise: 0
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
      var that = this;
      this.abilities = [
        function () {
          var playerPosition = that.sceneNode.Pos,
              abilityNumber = 0,
              cooldown = 10;
          if (!that.cooldowns[abilityNumber]) {
            ktah.abilities.postAbilityUse("taunt", that.id, playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
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
          var playerPosition = that.sceneNode.Pos,
              abilityNumber = 1,
              cooldown = 10;
          if (!that.cooldowns[abilityNumber]) {
            ktah.abilities.postAbilityUse("blendIn", that.id, playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
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