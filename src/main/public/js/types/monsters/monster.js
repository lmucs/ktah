/**
 * monster.js
 *
 * The abstract type of all monsters.
 */

$(function () {
  ktah.types.Monster = Backbone.Model.extend({
    defaults: {
      type: 'monster',
      id: null,
      health: 100,
      posX: 0,
      posZ: 0,
      sceneNode: null,
      target: 0
    },
    
    updateTarget: function () {
      var closestDistance = null,
          players = ktah.gamestate.players;
      for(var i = 0; i < players.length; i++) {
        if (closestDistance === null || closestDistance > this.sceneNode.Pos.getDistanceTo(new CL3D.Vect3d(players[i].posX, 1.3, players[i].posZ))) {
          closestDistance = this.sceneNode.Pos.getDistanceTo(new CL3D.Vect3d(players[i].posX, 1.3, players[i].posZ));
          this.target = i;
        }
      }
    },
    
    stepToTarget: function () {
      // console.log("monster " + this.id + " moving to player " + this.target);
    }
  });
});
