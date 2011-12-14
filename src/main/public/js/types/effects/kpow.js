/**
 * kpow.js
 *
 * Does things to your health if you touch it!
 * Stays a while.
 */

$(function () {
  ktah.types.Kpow = ktah.types.Effect.extend({
    defaults: {
      type: 'kpow',
      characterClass: null,
      sceneNode: null,
      id: null,
      timeLeft: 20,
      moveRate: 0.25,
      damage: 0
    },
    
    initialize: function (attributes, options) {
      this.defaultInitialize();
      this.type = 'kpow'
      this.timeLeft = 20;
      this.characterCollision = true;
      this.monsterCollision = true;
      this.collisionDist = 30;
      this.sceneNode.Pos.X = options.Pos.X;
      this.sceneNode.Pos.Z = options.Pos.Z;
      this.sceneNode.Pos.Y = 15;
      this.damage = (Math.random(1) - 0.5) * 6;
    },
    
    // Runs each iteration of main loop
    step: function (catchup) {
      if (!catchup) { catchup = 1;}
      if (!this.moveRate) { this.moveRate = 0.25;}
      // float upwards
      this.sceneNode.Pos.Y += catchup*this.moveRate;
      this.defaultStep(catchup);
    },
    
    // Returns the type of scene node it should be
    getSceneNode: function () {
      var billboard = new CL3D.BillboardSceneNode();
      var billSize = 30;
      if (this.damage) { billSize = Math.ceil(10 + 20 * Math.abs(this.damage) / 3); }
      console.log(this.damage);
      console.log(billSize);
      billboard.setSize(billSize, billSize);
      billboard.Pos.Y = 30;
      billboard.getMaterial(0).Tex1 = ktah.engine.getTextureManager().getTexture("../assets/effects/tinkerer/kpow.png", true);
      billboard.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL;
      return billboard;
    },
    
    getDamage: function () {
      return this.damage;
    }
    
  });
});
