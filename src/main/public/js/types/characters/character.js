/**
 * charClass.js
 *
 * Contains general character attributes between classes.
 * 
 */

$(function () {
  ktah.types.Character = ktah.types.Bipedal.extend({
    defaults: {
      
      // Public properties
      name: "",
      characterClass: null,
      id: null,
      level: 1,
      health: 100 // TODO: Arbitrary placeholder
    },
    
    texturization: function () {
      var engine = ktah.engine;
      this.sceneNode.getMaterial(0).Tex1 = engine.getTextureManager().getTexture("../assets/class_skins/vest_" + this.characterClass + ".jpg", true); // body armor
      this.sceneNode.getMaterial(1).Tex1 = engine.getTextureManager().getTexture("../assets/class_skins/body_" + this.characterClass + ".jpg", true); // legs & boots
      this.sceneNode.getMaterial(2).Tex1 = engine.getTextureManager().getTexture("../assets/class_skins/head_" + this.characterClass + ".jpg", true); // face
      this.sceneNode.getMaterial(3).Tex1 = engine.getTextureManager().getTexture("../assets/class_skins/eyes_" + this.characterClass + ".jpg", true); // eyes
      this.sceneNode.getMaterial(4).Tex1 = engine.getTextureManager().getTexture("../assets/class_skins/body_" + this.characterClass + ".jpg", true); // arms  
    },
    
    fadeAbilities: function (abilityNumber, abilityTimer) {
      $(".character-ability:nth-child(" + (abilityNumber + 1) + ")")
        .fadeTo(1, (1 / abilityTimer))
        .fadeTo(abilityTimer * 1000, 1)
        .effect("highlight", 1000);
    }
  });
});