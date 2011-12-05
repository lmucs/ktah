/**
 * abilities.js
 *
 * Handles ability usage from the standpoint
 * of clients being informed by the change in
 * gamestate.
 */

$(function () {
  
  // Informs the host of the use of an ability, who then
  // reports it to the other players on their respective "gets"
  ktah.abilities.postAbilityUse = function (ability, posX, posY, posZ, angle, cd) {
    $.ajax({
      type: 'POST',
      url: '/abilities/' + ktah.gamestate.environment.game,
      data: JSON.stringify(
        {
          "name": ability,
          "x": posX,
          "y": posY,
          "z": posZ,
          "theta": angle,
          "cooldown": cd
        }
      ),
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  };
  
  // Used by each player to see an ability used
  ktah.abilities.renderAbilities = function (abilityQueue) {
    for (var i = 0; i < abilityQueue.length; i++) {
      var currentAbility = abilityQueue[i];
      console.warn(abilityMap[currentAbility.name]);
      abilityMap[currentAbility.name](currentAbility.x, currentAbility.y, currentAbility.z, currentAbility.theta, currentAbility.cooldown);
    }
  };
  
  // Renders an architect's wall via copperlicht scene node
  ktah.abilities.buildWall = function (x, y, z, theta, cooldown) {
    var wall = ktah.scene.getSceneNodeFromName('wall').createClone(ktah.scene.getRootSceneNode());
    // TODO: Fix the maffs on the wall building
    wall.Rot.Y = theta + 270;
    wall.Pos.X = x + 10 * Math.cos(wall.Rot.Y + 180);
    wall.Pos.Y = y + 15;
    wall.Pos.Z = z + 10 * Math.sin(wall.Rot.Y);
    wall.Scale.Y = 4;
    wall.Scale.Z = 5;
    setTimeout(function () {
      ktah.scene.getRootSceneNode().removeChild(wall);
    }, cooldown * 1000);
  };
  
  var abilityMap = 
    {
      "simpleWall": ktah.abilities.buildWall
    };
  
});
