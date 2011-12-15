/**
 * closedBearTrap.js
 *
 * the result of a zombie walking to his doom.
 */

$(function () {
  ktah.types.ClosedBearTrap = ktah.types.Effect.extend({
    defaults: {
      type: 'closedBearTrap',
      characterClass: null,
      sceneNode: null,
      id: null,
      timeLeft: 20,
      moveRate: 1
    },
    
    initialize: function (attributes, options) {
      this.defaultInitialize();
      this.type = 'closedBearTrap'
      this.timeLeft = 500;
      this.characterCollision = false;
      this.monsterCollision = true;
      this.collisionDist = 20;
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
      var billboard = new CL3D.BillboardSceneNode(30);
      billboard.setSize(20,20);
      billboard.Pos.Y = 30;
      billboard.getMaterial(0).Tex1 = ktah.engine.getTextureManager().getTexture("../assets/effects/pioneer/bearTrapClosed.png", true);
      billboard.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL;
      return billboard;
    }
    
  });
});
