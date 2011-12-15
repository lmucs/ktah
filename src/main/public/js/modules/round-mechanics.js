/**
 * round-mechanics.js
 *
 * Handles round-mechanic stuff that involves creating
 * and destroying zombies after a round has begun or completed
 */

$(function () {
  
  // Variables to handle the round statistics and difficulties
  var BASE_AMOUNT = 17,
      BASE_SPEED = 0.95,
      BASE_LENGTH = 25,
      amount, // amount, walk speed, and round length make up the "difficulty"
      zombieWalkSpeed,
      roundLength = 30, // Time of round
      roundBreak = 10, // Time between rounds
      sceneNode,
      gameId,
      playerCollisionRadius,
      playerSlidingSpeed,
      resourceId = 0;
  
  ktah.util.queuedPoints = 0;
      
  // Sets / resets collision detection for a given monster
  ktah.util.addCollision = function (monsterNode) {
    monsterNode.addAnimator(
      new CL3D.AnimatorCollisionResponse(
        new CL3D.Vect3d(playerCollisionRadius,1,playerCollisionRadius), // y value 1 since not checking grav
        new CL3D.Vect3d(0,0,0), // no gravity!
        new CL3D.Vect3d(0,-10,0), // collision box way above head to make sure no problems with ground
        ktah.scene.getCollisionGeometry(),
        playerSlidingSpeed
      )
    );
  }
  
  // Creates a certain number of zombies on the host
  ktah.util.generateMonsters = function (sceneNode) {
    var monsterArray = [];    
    ktah.gamestate.monsters = [];
    for (var i = 0; i < amount; i++) {
      monsterArray[i] = new ktah.types.BasicZombie({posX: (Math.random() * 1000) - 500, posZ: (Math.random() * 1000) - 500, 
        walkSpeed: zombieWalkSpeed, lastZombie: (i === amount - 1)},
        {gameId: gameId, sceneNode: sceneNode});
      monsterArray[i].isZombie = true;
      ktah.util.addCollision(monsterArray[i].sceneNode);
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
        if(!data || (data && (!data.length || !data[data.length - 1].lastZombie))) {
          setTimeout(function() {ktah.util.synchronizeMonsters(sceneNode);}, 100);
        } else {
          for (var i = 0; i < data.length; i++) {
            monsterArray[i] = new ktah.types.BasicZombie({posX: data[i].posX, posZ: data[i].posZ, id: data[i].id, walkSpeed: zombieWalkSpeed},
              {gameId: gameId, sceneNode: sceneNode});
            monsterArray[i].isZombie = true;
              ktah.util.addCollision(monsterArray[i].sceneNode);
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
  
  // Updates the round timer on the UI
  ktah.util.tickTimer = function (timeRemaining) {
    $("#round-timer")
      .progressbar("value", (timeRemaining / roundLength) * 100);
    if (timeRemaining) {
      setTimeout(function() {
        ktah.util.tickTimer(timeRemaining - 1);
      }, 1000);
    }
  }
  
  // Starts a game round by creating the zombies
  ktah.util.beginRound = function (playerNumber) {
    // Update the difficulty based on the round
    var currentRound = ktah.gamestate.environment.round;
    amount = BASE_AMOUNT + (1 * currentRound);
    zombieWalkSpeed = BASE_SPEED + (0.07 * currentRound);
    roundLength = BASE_LENGTH + (5 * currentRound);
    
    // Have the host create monsters, and clients synchronize
    if (playerNumber === 0) {
      ktah.monsterArray = ktah.util.generateMonsters(sceneNode);
      setTimeout(function () {
        ktah.util.reportEndRound();
      }, roundLength * 1000);
    } else {
      ktah.util.synchronizeMonsters(sceneNode);
    }
    
    // Next, do the proper updates and reporting
    $("#round-display")
      .fadeOut(2000, function () {$(this).html("Round: " + currentRound)})
      .fadeIn(2000);
      
    ktah.util.tickTimer(roundLength - ktah.gamestate.environment.round);
  }
  
  // Creates resources for all the players to collect at random parts of the map
  ktah.util.resourceSpawning = function () {
    // Use the ability framework to spawn a resource, selecting one at random
    var resourceDeJure;
    switch (Math.floor(Math.random() * 5)) {
      case 0: resourceDeJure = "wood"; break;
      case 1: resourceDeJure = "stone"; break;
      case 2: resourceDeJure = "toxicWaste"; break;
      case 3: resourceDeJure = "zombieFlesh"; break;
      case 4: resourceDeJure = "medKit"; break;
    }
    ktah.resources.createResource(resourceId, resourceDeJure);
    resourceId++;
    setTimeout(function() {
      ktah.util.resourceSpawning();
    }, (20 + (Math.random() * 20)) * 1000);
  }
  
  // Removes a monster from the game and shows it being killed off!
  ktah.util.killMonster = function (monster) {
    var sceneRoot = ktah.scene.getRootSceneNode();
    // Make more natural death animations
    setTimeout(function() {
      monster.die();
      //monsterNode.setLoopMode(false);
      //monsterNode.setAnimation("die");
      // REMOVE ZEE BODIES
      setTimeout(function() {
        sceneRoot.removeChild(monster.sceneNode);
      }, 1250);
    }, Math.random() * 1500);
  }
  
  ktah.util.roundMessage = function (message, color) {
    $("#round-note")
      .css("background-color", color)
      .html(message)
      .fadeIn(2000)
      .fadeOut(2000);
  }
  
  // Cleans up scene nodes and the timer from a round
  ktah.util.resolveRound = function (playerNumber) {
    var pointsGained = ktah.gamestate.environment.round * 20;
    // Begin by clearing the monster array
    for (var i = 0; i < ktah.monsterArray.length; i++) {
      ktah.util.killMonster(ktah.monsterArray[i]);
    }
    ktah.monsterArray = [];
    ktah.gamestate.monsters = [];
    
    // Tell the players how awesome they are
    ktah.util.roundMessage("K'tah sleeps... for now...", "black");
    ktah.util.queuedPoints += ktah.gamestate.environment.round * 20;
  }
  
  // Ends a game round by destroying all zombies, then doing next round stuff
  ktah.util.reportEndRound = function () {
    $.ajax({
      type: 'POST',
      url: '/round/' + gameId,
      data: JSON.stringify({"roundLength": roundLength, "waitTime": roundBreak}),
      success: function (data) {
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
  
  // Begins the round mechanics for the game
  ktah.util.initializeRoundMechanics = function (playerNumber, playerSlide, playerCollisionSize) {
    sceneNode = ktah.scene.getSceneNodeFromName('ghoul');
    gameId = ktah.gamestate.environment.game;
    playerSlidingSpeed = playerSlide;
    playerCollisionRadius = playerCollisionSize; 
    // Let players set up first and join
    if (playerNumber === 0) {
      ktah.util.reportEndRound();
      ktah.util.resourceSpawning();
    }
  }
  
});
