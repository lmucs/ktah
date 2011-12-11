/**
 * round-mechanics.js
 *
 * Handles round-mechanic stuff that involves creating
 * and destroying zombies after a round has begun or completed
 */

$(function () {
  
  // Variables to handle the round statistics and difficulties
  var amount = 20,
      sceneNode,
      zombieWalkSpeed = 1.0,
      gameId,
      roundNumber = 1,
      roundLength = 30;
  
  // Creates a certain number of zombies on the host
  ktah.util.generateMonsters = function (sceneNode) {
    var monsterArray = [];    
    ktah.gamestate.monsters = [];
    for (var i = 0; i < amount; i++) {
      monsterArray[i] = new ktah.types.BasicZombie({posX: (Math.random() * 1000) - 500, posZ: (Math.random() * 1000) - 500, lastZombie: (i === amount - 1)}
        ,{gameId: gameId, sceneNode: sceneNode});
      monsterArray[i].isZombie = true;
      monsterArray[i].walkSpeed = zombieWalkSpeed;
      // Want to add zombie collision with world here, but way too memory intensive right now or something
      // makes grass texture disappear and collision for player stop working
      //monsterArray[i].sceneNode.addAnimator(playerCollisionAnimator);
    }
    return monsterArray;
  }
  
  // Synchronizes the gamestate for clients to reflect host created zombies
  ktah.util.synchronizeMonsters = function (sceneNode) {
    $.ajax({
      type: 'GET',
      url: '/monsters/' + gameId,
      success: function (data) {
        var monsterArray = [];
        if(!data || (data && !data[data.length - 1].lastZombie)) {
          setTimeout(function() {ktah.util.synchronizeMonsters(sceneNode);}, 200);
        } else {
          for (var i = 0; i < data.length; i++) {
            monsterArray[i] = new ktah.types.BasicZombie({posX: data[i].posX, posZ: data[i].posZ, id: data[i].id},{gameId: gameId, sceneNode: sceneNode});
          }
          ktah.monsterArray = monsterArray;
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
  // Starts a game round by creating the zombies
  ktah.util.beginRound = function (playerNumber) {
    if (playerNumber === 0) {
      ktah.monsterArray = ktah.util.generateMonsters(sceneNode);
      setTimeout(function () {
        ktah.util.endRound();
      }, roundLength * 1000);
    } else {
      ktah.util.synchronizeMonsters(sceneNode);
    }
  }
  
  // Ends a game round by destroying all zombies, then doing next round stuff
  ktah.util.endRound = function () {
    console.warn("Round ended!");
  }
  
  // Begins the round mechanics for the game
  ktah.util.initializeRoundMechanics = function (playerNumber) {
    sceneNode = ktah.scene.getSceneNodeFromName('ghoul');
    gameId = ktah.gamestate.environment.game;
    ktah.util.beginRound(playerNumber);
  }
  
});
