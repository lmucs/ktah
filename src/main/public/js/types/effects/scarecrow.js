/**
 * scarecrow.js
 *
 * Attract the zombies with a scarecrow!!
 */

$(function () {
  ktah.types.Scarecrow = ktah.types.Effect.extend({
    defaults: {
      type: 'scarecrow',
      characterClass: null,
      sceneNode: null,
      id: null,
      timeLeft: 20,
      moveRate: 1
    },
    
    initialize: function (attributes, options) {
      this.defaultInitialize();
      this.type = 'scarecrow'
      this.timeLeft = 1000;
      this.characterCollision = false;
      this.monsterCollision = false;
      this.collisionDist = 50;
      this.sceneNode.Pos.X = options.Pos.X;
      this.sceneNode.Pos.Z = options.Pos.Z;
      this.sceneNode.Pos.Y = 10;
    },
    
    // Runs each iteration of main loop
    step: function (catchup) {
      this.defaultStep(catchup);
    },
    
    // Returns the type of scene node it should be
    getSceneNode: function () {
      var billboard = new CL3D.BillboardSceneNode();
      billboard.setSize(20,20);
      billboard.Pos.Y = 30;
      billboard.getMaterial(0).Tex1 = ktah.engine.getTextureManager().getTexture("../assets/effects/herder/scarecrow.png", true);
      billboard.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL;
      return billboard;
    }
    
  });
});
