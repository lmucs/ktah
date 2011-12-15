/**
 * stoneWall.js
 *
 * Bounces everyone away
 */

$(function () {
  ktah.types.StoneWall = ktah.types.Effect.extend({
    defaults: {
      type: 'stoneWall',
      characterClass: null,
      sceneNode: null,
      id: null,
      timeLeft: 20,
      moveRate: 1
    },
    
    initialize: function (attributes, options) {
      this.defaultInitialize();
      this.type = 'stoneWall'
      this.timeLeft = 2000;
      this.characterCollision = true;
      this.monsterCollision = true;
      this.collisionDist = 25;
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
      var billboard = new CL3D.CubeSceneNode(20);
      billboard.Scale.Y = 3.0;
      billboard.Pos.Y = 30;
      billboard.getMaterial(0).Tex1 = ktah.engine.getTextureManager().getTexture("../assets/effects/architect/brickWall.jpg", true);
      //billboard.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL;
      return billboard;
    }
    
  });
});
