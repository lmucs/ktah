/**
 * path.js
 *
 * Makes people run faster when on it.
 * stays for a while (and listens! Not really...)
 */

$(function () {
  ktah.types.Path = ktah.types.Effect.extend({
    defaults: {
      type: 'path',
      characterClass: null,
      sceneNode: null,
      id: null,
      timeLeft: 20,
      moveRate: 1
    },
    
    initialize: function (attributes, options) {
      this.defaultInitialize();
      this.type = 'path'
      this.timeLeft = 1000;
      this.characterCollision = true;
      this.zombieCollision = true;
      this.collisionDist = 50;
      this.sceneNode.Pos.X = options.Pos.X;
      this.sceneNode.Pos.Z = options.Pos.Z;
      this.sceneNode.Pos.Y = 0;
    },
    
    // Runs each iteration of main loop
    step: function (catchup) {
      this.defaultStep(catchup);
    },
    
    // Returns the type of scene node it should be
    getSceneNode: function () {
      var billboard = new CL3D.CubeSceneNode(50);
      billboard.Scale.Y = 0.01;
      /*
      var billboard = new CL3D.BillboardSceneNode();
      billboard.setSize(20,20);
      */
      billboard.Pos.Y = 30;
      billboard.getMaterial(0).Tex1 = ktah.engine.getTextureManager().getTexture("../assets/effects/pioneer/path.jpg", true);
      billboard.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL;
      return billboard;
    }
    
  });
});
