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
        toxicWaste: 0,
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
          var playerPosition = that.sceneNode.Pos,
              abilityNumber = 0,
              cooldown = 5;
              console.log(playerPosition);
          if (!that.cooldowns[abilityNumber]) {
            ktah.abilities.postAbilityUse("kpow", that.id, playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
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
              abilityNumber = 1,
              cooldown = 10;
              console.log(playerPosition);
          if (!that.cooldowns[abilityNumber]) {
            ktah.abilities.postAbilityUse("kbam", that.id, playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
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
            console.log(playerPosition);
        if (!that.cooldowns[abilityNumber]) {
          ktah.abilities.postAbilityUse("kboom", that.id, playerPosition.X, playerPosition.Y, playerPosition.Z, that.sceneNode.Rot.Y, cooldown);
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