/**
 * pow.js
 *
 * An exclamation from being hit!
 * Appears, then fades away.
 */

$(function () {
  ktah.types.Pow = ktah.types.Effect.extend({
    defaults: {
      type: 'pow',
      characterClass: null,
      sceneNode: null,
      id: null,
      timeLeft: 20,
      moveRate: 1
    },
    
    initialize: function (attributes, options) { //basis) {
      this.defaultInitialize();
      this.moveRate = 1;
      this.sceneNode.Pos.X = options.Pos.X;
      this.sceneNode.Pos.Z = options.Pos.Z;
      this.sceneNode.Pos.Y = 10;
    },
    
    // Runs each iteration of main loop
    step: function (catchup) {
      // float upwards
      this.sceneNode.Pos.Y += catchup*this.moveRate;
      this.defaultStep(catchup);
    },
    
    // Returns the type of scene node it should be
    getSceneNode: function () {
      var billboard = new CL3D.BillboardSceneNode();
      billboard.setSize(20,20);
      billboard.Pos.Y = 30;
      billboard.getMaterial(0).Tex1 = ktah.engine.getTextureManager().getTexture("../assets/effects/pow.png", true);
      billboard.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL;
      return billboard;
    }
    
  });
});
