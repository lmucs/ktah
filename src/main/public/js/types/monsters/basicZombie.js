/**
 * monster.js
 *
 * Contains general basicZombie attributes and functions.
 */

$(function () {
    ktah.types.BasicZombie = ktah.types.Monster.extend({
      initialize: function(scene, sceneNode) {
        var basicZombie = sceneNode.createClone(scene);
        
        //TODO: Randomize these but with some limitations?
        basicZombie.Pos.X = 0;
        basicZombie.Pos.Z = 0;
      }
    });
});