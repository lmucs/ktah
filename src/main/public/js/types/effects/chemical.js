/**
 * chemical.js
 *
 * Does things to your health if you touch it!
 * Stays a while.
 */

$(function () {
  ktah.types.Chemical = ktah.types.Effect.extend({
    defaults: {
      type: 'chemical',
      characterClass: null,
      sceneNode: null,
      id: null,
      timeLeft: 20,
      moveRate: 1
    },
    
    initialize: function (attributes, options) {
      this.defaultInitialize();
      this.type = 'chemical'
      this.timeLeft = 1000;
      this.characterCollision = true;
      this.monsterCollision = true;
      this.collisionDist = 40;
      this.sceneNode.Pos.X = options.Pos.X;
      this.sceneNode.Pos.Z = options.Pos.Z;
      this.sceneNode.Pos.Y = 1;
    },
    
    // Runs each iteration of main loop
    step: function (catchup) {
      this.defaultStep(catchup);
    },
    
    // Returns the type of scene node it should be
    getSceneNode: function () {
      var billboard = new CL3D.CubeSceneNode(50);
      billboard.Scale.Y = 0.0;
      billboard.Pos.Y = 30;
      billboard.getMaterial(0).Tex1 = ktah.engine.getTextureManager().getTexture("../assets/effects/scientist/goo.png", true);
      billboard.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL;
      return billboard;
    }
    
  });
});
