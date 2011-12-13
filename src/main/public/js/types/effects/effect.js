/**
 * effect.js
 *
 * The consequence of an ability being used,
 * appears on the map and has a reaction
 * upon collision.
 */

$(function () {
  ktah.types.Effect = Backbone.Model.extend({
    defaults: {
      type: 'wall',
      characterClass: null,
      sceneNode: null,
      id: null,
      timeLeft: 100,
      dying: true, 
      moveRate: 1
    },
    
    initialize: function (attributes, options) { //basis) {
      this.defaultInitialize();
    },
    
    // used in place of a super.initialize()
    defaultInitialize: function ()  {      
      //this.type = basis.type;
      this.dying = true;
      this.timeLeft = 20;
      this.moveRate = 0;
      this.sceneNode = this.getSceneNode();
      ktah.scene.getRootSceneNode().addChild(this.sceneNode);
      this.sceneNode.Pos = new CL3D.Vect3d(0,30,0);//basis.pos;
    },
    
    // designed to be called every iteration of main loop
    step: function (catchup) {
      this.defaultStep(catchup);
    },
    
    // used in place of a super.step()
    defaultStep: function (catchup) {
    // Catchup is for anti-lag, but if not present, default to one
      if (!catchup) { catchup = 1; }
      
      if (this.dying) {
        this.timeLeft -= catchup;
        if (this.timeLeft <= 0) {
          this.die();
        }
      }
    },
    
    // Returns the type of scene node it should be
    getSceneNode: function () {
      return this.defaultGetSceneNode();
    },
    
    // used in place of a super.getSceneNode()
    defaultGetSceneNode: function () {
      var billboard = new CL3D.BillboardSceneNode();
      billboard.setSize(20,20);
      billboard.Pos.Y = 30;
      billboard.getMaterial(0).Tex1 = ktah.engine.getTextureManager().getTexture("../assets/effects/puff.png", true);
      billboard.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ADD_COLOR;
      //billboard.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL; // the screen effect alternative, lightens what's behind it
      return billboard;
    },
    
    // Kills off the self, removes from scene
    die: function () {
      this.defaultDie();
    },
    
    // used in place of a super.die()
    defaultDie: function () {
      ktah.scene.getRootSceneNode().removeChild(this.sceneNode);
    }
    
  });
});
