/**
 * monster.js
 *
 * The abstract type of all monsters.
 */

$(function () {
  ktah.types.Monster = ktah.types.Bipedal.extend({
    defaults: {
      type: 'monster',
      id: null,
      health: 100,
      posX: 0,
      posZ: 0,
      sceneNode: null,
      target: 0 //not sure if we need this here, since target is a result of
                //current position and positions of other zombies and
                //humans, which are very dynamic
    },
    
    updateTarget: function (players, monsterArray) {
        //test:
        console.log("players: " + JSON.stringify(players));
        console.log("monsterArray: " + JSON.stringify(monsterArray));
      var closestDistance = null;
      var target;
      var targetPoint;
      var closestPlayer;
      var closestMonster;
          //players = ktah.gamestate.players;
      for(var i = 0; i < players.length; i++) {
        if (closestDistance === null || closestDistance > this.sceneNode.Pos.getDistanceTo(new CL3D.Vect3d(players[i].posX, 1.3, players[i].posZ))) {
          closestDistance = this.sceneNode.Pos.getDistanceTo(new CL3D.Vect3d(players[i].posX, 1.3, players[i].posZ));
          //this.target = i;
          target = i;
        }
      }
      
      //get the coords of the chosen target
      //targetPoint = {x: target.pos.x, y: target.pos.y};
      
      //Handle obstacle avoidance:
      //targetPoint = this.navigate(targetPoint);
      
        //test:
        //for right now, just direct the zombies to (0, 0):
        //this.
      
      //Direct it to the desired point:
      //this.stepToTarget(targetPoint);
    },
    
    stepToTarget: function () {
      // console.log("monster " + this.id + " moving to player " + this.target);
      
    },
    
    //Check to see whether there is an obstacle between the monster and the
    //present target. If so, point the monster at the way to get around the
    //obstacle that is closest to the original target.
    navigate: function () {//List of obstacles: scene.getRootSceneNode.getChildren
        //test, for now:
        return target;
    }
    
  });
});
