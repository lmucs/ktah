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
    
    updateTarget: function (players) {
      var closestDistance = null;
      for (var i = 0; i < players.length; i++) {
        if (closestDistance === null || closestDistance > this.sceneNode.Pos.getDistanceTo(new CL3D.Vect3d(players[i].posX, 1.3, players[i].posZ))) {
          closestDistance = this.sceneNode.Pos.getDistanceTo(new CL3D.Vect3d(players[i].posX, 1.3, players[i].posZ));
          this.target = i;
        }
      }
    }
  });
});
