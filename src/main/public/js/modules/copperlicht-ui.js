/**
 * copperlicht-ui.js
 *
 * Contains the basic user-interaction elements
 * that copperlicht uses to update its display.
 */

$(function() {
  
  var engine = ktah.engine = startCopperLichtFromFile('ktahCanvas', '../../assets/copperlicht/copperlichtdata/zombieTestRedux.ccbjs'),
  playerSceneNode = null,
  scene = null,
  key = null;
  
  engine.addScene(scene);

  // Setup dynamic lighting
  var lightNode, enableLighting = false, lightAttenuation = 0.5, renderer = engine.getRenderer(), // lighting working now
  
  // Rate of how much to play catchup so stats applied equally
  catchupRate = 1.0, catchupRateEnabled = true, lastTime = timeDiff = 0.0, currentTime,
  timeDiffs = [], timeDiffsCurrent = 0, timeDiffsTotal = 10, timeDiffsStartingUp = true, avgTimeDiff = 0,
  timeLoopLength = 1, // how many loops before updating the timestamp again/checking in on lag
  catchupCounterbalance = 50.0, timeLoopCurrent = 0,
  startingY = 0.0,
  startingX = 0.0,
  startingZ = 0.0,
  
  // Player collision animator used to incorporate Copperlicht collision detection
  playerCollisionAnimator, // initialized once scene loaded
  playerCollisionRadius = 6, playerSlidingSpeed = 10,

  // Camera positioning values
  camSetDist = 10, camDistRatio = 1.0,

  // Last direction traveled
  difX = -1.0, difZ = 0.0, dirAngle = 0.0,

  // Camera positioning values
  camSetDist = 10,
  camDistRatio = 1.0,
  zoomDist = 10,
  zoomDistMin = -3,
  zoomDistMax = 15,
  zoomSpeed = -2,
  isometricView = true, // should be true
  cameraStarted = false,
  mouseIsDown = false,
  mouseClicked = false,
  mouseClickedTimer = 0,

  // Visual effects
  arrow, arrowHeight = 10,

  // Variables for keyboard controls
  wKey = aKey = sKey = dKey = upKey = leftKey = downKey = rightKey = resetKey = standKey = false;

  // Universal Camera Setup
  var cam = new CL3D.CameraSceneNode();
  var animator = new CL3D.AnimatorCameraFPS(cam, engine);
  cam.addAnimator(animator);
  
  // Gameplay mechanics
  var beingAttacked = -1,
      gameId = $("#gameId").attr("data"),
      userName = $("#userName").attr("data"),
      playerNumber = 0,
      playerCount = 0,
      usingAbility = 0,
      abilityList = [],
      notificationReporting = false,
      leftGame = false,
      gameOver = false,
      
      // Function that clears and then sets up the user interface
      // called once at beginning and every time a player leaves / joins
      updateUserInterface = function () {
        var currentPlayer = "",
            nametagAccent = "";
        
        // Setup round timer and points
        $("#health-display")
        .html("")
        .append(
          "<div id='round-info'><span id='round-time'>Time: <span id='time-remaining' class='round-info-space'>0:00</span></span>"
          + "<span id='points'>Points: <span id='points-remaining' class='currentPlayerNametag'>"
          + ktah.gamestate.players[playerNumber].pointsRemaining + "</span></span></div>"
        );
        
        for (var i = 0; i < playerCount; i++) {
          currentPlayer = ktah.gamestate.players[i];
          nametagAccent = "",
          classIcon = "";
          
          // Accent the nametag of the local player
          if (i === playerNumber) {
            nametagAccent = "class='currentPlayerNametag'";
          }
          
          // Provide a small class-icon next to a player's name
          classIcon = '<img class="player-class" src="../assets/icons/' + currentPlayer.character + 'Icon.png"></img>'
          
          // Setup health display
          $("#health-display").append(
            "<div id='" + currentPlayer.name + "-stats' class='player-stats'><div " + nametagAccent + ">" 
            + classIcon + " " + currentPlayer.name + "</div>"
            + "<div id='" + currentPlayer.name + "-health-num-box' class='player-health-num-box'>"
            + "<div id='" + currentPlayer.name + "-health-bar' class='player-health-bar'>&nbsp</div>"
            + "<span class='player-healthNum'>" + currentPlayer.health + " / 100</span>"
            + "</div></div>"
          );
        }
      },
      
      // Updates the character array and the player's position within it
      // Set initialization to true for first time setup and population of characters
      updateCharacterArray = function (currentNumber, initialization) {
        var updatedCharacters = [],
            currentCharacter = "";
        playerCount = ktah.gamestate.players.length;
        // Setup player information
        for (var i = 0; i < playerCount; i++) {
          // If it's the first setup, populate the array
          if (initialization) {
            var protoSoldier = scene.getSceneNodeFromName('soldier');
            currentCharacter = ktah.gamestate.players[i].character;
            
            // Set the player's class selection
            if (currentCharacter === "architect") {
              ktah.characterArray[i] = new ktah.types.Architect({},{sceneNode: protoSoldier});
            } else if (currentCharacter === "chemist") {
              ktah.characterArray[i] = new ktah.types.Chemist({},{sceneNode: protoSoldier});
            } else if (currentCharacter === "herder") {
              ktah.characterArray[i] = new ktah.types.Herder({},{sceneNode: protoSoldier});
            } else if (currentCharacter === "pioneer") {
              ktah.characterArray[i] = new ktah.types.Pioneer({},{sceneNode: protoSoldier});
            } else if (currentCharacter === "tinkerer") {
              ktah.characterArray[i] = new ktah.types.Tinkerer({},{sceneNode: protoSoldier});
            }
            
            ktah.characterArray[i].playerName = ktah.gamestate.players[i].name;
            ktah.characterArray[i].playing = true;
            ktah.characterArray[i].isZombie = false;
            ktah.characterArray[i].walkSpeed = 1.85;
            ktah.characterArray[i].sceneNode.Pos.Z += i * 15;
            ktah.characterArray[i].sceneNode.Pos.Y = 1.3;
            
            // Load textures onto classes here
            ktah.characterArray[i].texturization();
            ktah.characterArray[i].versionNumber(); // DELETEME this is a test to make sure functions can be called from here
            
            if (ktah.gamestate.players[i].name === userName) {
              playerNumber = i;
              
              // For the current player, set up the class-specific UI
              for (var currentResource in ktah.characterArray[i].resources) {
                $("#character-resources").append(
                  '<span class="character-resource">'
                  + '<div class="character-resource-icon">&nbsp</div>'
                  + '<div class="character-resource-bar">&nbsp</div>'
                  + '<div class="character-resource-text">0 / 3</div></span>'
                );
              }
              
              // Set up the player abilities
              // TODO: Change iterators based on abilities available
              for (var j = 1; j < 6; j++) {
                $("#character-abilities").append(
                  '<div class="character-ability">' + j + '</div>'
                );
              }
              
              // Bind click events to the abilities
              $("#character-abilities").children().each(function(index) {
                $(this)
                  .button({icons: {secondary:'ui-icon-locked'}})
                  .click(function () {
                    usingAbility = index + 1;
                  });
              });
            }
            
          // Otherwise, it's an update
          } else {
            // Reset all the "playing" tags of the scene nodes so that the ones that
            // no longer are active can be culled by process of elimination
            for (var k = 0; k < ktah.characterArray.length; k++) {
              ktah.characterArray[k].playing = false;
            }
            
            for (var j = 0; j < ktah.characterArray.length; j++) {
              // This lamely removes the player that left by adding the active ones
              // to a new, updated character array
              if (ktah.gamestate.players[i].name === ktah.characterArray[j].playerName) {
                updatedCharacters.push(ktah.characterArray[j]);
                updatedCharacters[updatedCharacters.length - 1].playerName = ktah.characterArray[j].playerName;
                updatedCharacters[updatedCharacters.length - 1].playing = ktah.characterArray[j].playing = true;
              }
            }
          }
        }
        
        // If this was a mid-game update, set the players back up
        if (!initialization) {
          // Nuke the "zombie" scene node (pun intended, just nuke the node the player left)
          for (var k = 0; k < ktah.characterArray.length; k++) {
            if (!ktah.characterArray[k].playing) {
              scene.getRootSceneNode().removeChild(ktah.characterArray[k]);
            }
          }
          // Now, set the ktah.characterArray to its updated form
          ktah.characterArray = updatedCharacters;
          // Now we have to reset the player numbers in the new array
          for (var i = 0; i < ktah.characterArray.length; i++) {
            if (updatedCharacters[i].playerName === userName) {
              playerNumber = i;
            }
          }
        }
        
        // Grab the character that the player is controlling
        playerSceneNode = ktah.characterArray[playerNumber].sceneNode;
        updateUserInterface();
      };
  
  // Called when loading the 3d scene has finished (from the coppercube file)
  engine.OnLoadingComplete = function () {
    var synchronizedUpdate = seedGamestate();
    
    if (ktah.gamestate.players) {
      scene = ktah.scene = engine.getScene();
      if (scene) {
        // Add the players to the character array
        updateCharacterArray(ktah.gamestate.players.length, true);
        // Collision for player set when scene loaded
        playerCollisionAnimator = new CL3D.AnimatorCollisionResponse(
          new CL3D.Vect3d(playerCollisionRadius,1,playerCollisionRadius), // y value 1 since not checking grav
          new CL3D.Vect3d(0,0,0), // no gravity!
          new CL3D.Vect3d(0,-10,0), // collision box way above head to make sure no problems with ground
          scene.getCollisionGeometry(),
          playerSlidingSpeed
        );
        playerSceneNode.addAnimator(playerCollisionAnimator);
        
        if (enableLighting) {
          // And add a light to the player
          lightNode = new CL3D.LightSceneNode(0);
          lightNode.LightData.Color = new CL3D.ColorF(1,1,1,1);
          lightNode.LightData.Attenuation = lightAttenuation;
          playerSceneNode.addChild(lightNode);
          // used to use scene.getRootSceneNode()
          var arrayOfSceneNodes = scene.getAllSceneNodesOfType("mesh");
          for (x in arrayOfSceneNodes) {
           for (var i = 0; i<arrayOfSceneNodes[x].getMaterialCount(); i++) {
              arrayOfSceneNodes[x].getMaterial(i).Lighting = true;
            }
          }
          renderer.addDynamicLight(lightNode);
        }
        
        // Initialize the visual effects
        // Add the arrow to show destination
        arrow = new CL3D.BillboardSceneNode();
        arrow.setSize(20,20);
        arrow.Pos = (0,0,0);
        arrow.getMaterial(0).Tex1 = engine.getTextureManager().getTexture("../assets/effects/arrow.png", true);
        arrow.getMaterial(0).Type = CL3D.Material.EMT_TRANSPARENT_ADD_COLOR;
        scene.getRootSceneNode().addChild(arrow);

      } else {
        return;
      }
      
      // Finish setting up by adding camera to scene
      scene.getRootSceneNode().addChild(cam);
      scene.setActiveCamera(cam);
      
      var protoGhoul = scene.getSceneNodeFromName('ghoul');
      
      if (playerNumber === 0) {
        ktah.monsterArray = generateMonsters(protoGhoul, 20);
        //ktah.monsterArray = generateMonsters(protoGhoul, 1);
      } else {
        synchronizeMonsters(protoGhoul);
      }
      
      // Make host add collision detection for zombies:
      if (playerNumber === 0) {
        for (var i = 0; i < ktah.monsterArray.length; i++) {
          var monsterCollisionAnimator = new CL3D.AnimatorCollisionResponse(
            new CL3D.Vect3d(playerCollisionRadius,1,playerCollisionRadius), // y value 1 since not checking grav
            new CL3D.Vect3d(0,0,0), // no gravity!
            new CL3D.Vect3d(0,-10,0), // collision box way above head to make sure no problems with ground
            scene.getCollisionGeometry(),
            playerSlidingSpeed
          );
          ktah.monsterArray[i].sceneNode.addAnimator(monsterCollisionAnimator);
        }
        
      }
      
      // Begin the server pinging and end-condition checking
      setInterval(updateTeam, 50);
      setInterval(gameEndCheck, 5000);
      
      // Remove the loading screen
      $("#loadingScreen").fadeOut(3000);
      
      // Kick any PHONIES from the game
      for (var i = 0; i < playerCount; i++) {
        if (userName === ktah.characterArray[i].playerName) {
          return;
        }
      }
      // If we get here, we're a PHONY!
      bootMiscreants("You tried to access this game illegally. This incident has been reported.");
    } else {
      setTimeout(engine.OnLoadingComplete, 250);
    }    
  };
  
  // Default camera instructions
  var camFollow = function(cam, target) {
    if (isometricView) {
      isometricCam(cam, target);
    } else {
      shoulderCam(cam, target);
    }
  },
  
  // Over the shoulder camera
  shoulderCam = function(cam, target) {
    cam.Pos.X = target.Pos.X - difX * camDistRatio;
    cam.Pos.Y = target.Pos.Y + 20;
    cam.Pos.Z = target.Pos.Z - difZ * camDistRatio;
    animator.lookAt(new CL3D.Vect3d(playerSceneNode.Pos.X, playerSceneNode.Pos.Y + 10, playerSceneNode.Pos.Z));
  },
  
  // Isometric camera
  isometricCam = function(cam, target) {
    cam.Pos.X = target.Pos.X + (camSetDist + zoomDist);
    cam.Pos.Y = target.Pos.Y + (camSetDist + 2*zoomDist  + 10);
    cam.Pos.Z = target.Pos.Z - (camSetDist + zoomDist);
    animator.lookAt(new CL3D.Vect3d(playerSceneNode.Pos.X, playerSceneNode.Pos.Y + 10, playerSceneNode.Pos.Z));
  },
  
  // Helper method used to report messages to the player
  notify = function (message, messageColor) {
    if (!notificationReporting) {
      notificationReporting = true;
      $("#notifications")
        .html(message)
        .css("background-color", messageColor)
        .fadeIn(750)
        .fadeOut(750, function () {
          notificationReporting = false;
        });
    }
  },
  
  // Do stuff based on when a character uses an ability
  useAbility = function (key) {
    abilityResult = ktah.characterArray[playerNumber].abilities[key - 1]();
    // Use the ability as defined in the created character
    // If the ability is locked, the conditional will evaluate to false
    if (typeof(abilityResult) === "undefined") {
      // Make sure you don't spam errors
      notify("Ability Not Available", "red");
    } else if (abilityResult !== -1) {
      notify("Ability Recharging (" + abilityResult + "s)", "orange");
    }
  },
  
  // A more complicated key change state event. Uppercase and lowercase
  // letters both referenced due to keydown vs keypress differences
  keyStateChange = function(key, bool) {
    // Displays key value, for learning new key cases
    // alert(key);
    // When pressing w, move forward, s back
    // a move left, d move right
    switch (key) {
      case 'w':
      case 'W':
      case '&':
        // up arrow
        wKey = bool;
        break;
      case 's':
      case 'S':
      case '(':
        // down arrow
        sKey = bool;
        break;
      case 'a':
      case 'A':
      case '%':
        // left arrow
        aKey = bool;
        break;
      case 'd':
      case 'D':
      case "'":
        // right arrow
        dKey = bool;
        break;
      case '0':
        // reset key is zero
    	resetKey = bool;
    	break;
    	
    	// Ability usage keys
    	case '1':
    	case '2':
    	case '3':
    	case '4':
    	case '5':
    	  usingAbility = key; 
    	  break;
    	case '': // There is a Left Shift character here, eclipse just can't display it
        standKey = bool;
        break;
      default:
        break;
    }
  },
  
  whileMouseDown = function() {
  	var mousePoint = engine.get3DPositionFrom2DPosition(engine.getMouseDownX(),engine.getMouseDownY());
  	var newGoal = scene.getCollisionGeometry().getCollisionPointWithLine(cam.Pos, mousePoint, true, null);
      
  	if (newGoal) {
      var currentCharacter = ktah.characterArray[playerNumber];//ktah.gamestate.players[playerNumber];
      currentCharacter.updateGoal(newGoal);

      // so if arrow exists, position it at goal to show where goal is
      if (arrow && currentCharacter.getGoal()) {
        arrow.Pos = currentCharacter.getGoal();
        arrow.Pos.Y = currentCharacter.getGoal().Y + arrowHeight;  
      }
  	}
  },

  // Helper function for animation display
  animateCharacter = function (characterIndex, animation) {
    var currentChar = ktah.characterArray[characterIndex].sceneNode;
    if (currentChar.currentAnimation !== animation) {
      currentChar.setLoopMode(animation !== "aim");
      if (currentChar.currentAnimation !== "aim") {
        currentChar.currentAnimation = animation;
        currentChar.setAnimation(animation);
      }
    }
    if (animation === "aim") {
      setTimeout(function () {
        currentChar.currentAnimation = "run";
        animateCharacter(characterIndex, "run");
      }, 600);
    }
  },
  
  animateMonster = function (monsterIndex, animation) {
    if (monsterIndex < ktah.monsterArray.length) {
      var currentMonster = ktah.monsterArray[monsterIndex].sceneNode;
      if (currentMonster.currentAnimation !== animation) {
        currentMonster.setLoopMode(animation !== "look");
        if (currentMonster.currentAnimation !== "look") {
          currentMonster.currentAnimation = animation;
          currentMonster.setAnimation(animation);
        }
      }
      if (animation === "look") {
        setTimeout(function () {
          currentMonster.currentAnimation = "walk";
          animateMonster(currentMonster, "walk");
        }, 600);
      }
    }
  },
  
  // Helper function to store the asynchronous gamestate data
  updateGamestate = function (data) {
    if (playerNumber === 0) {
      ktah.gamestate.players = data.players;
      ktah.gamestate.environment = data.environment;
    } else {
      ktah.gamestate = data;
    }
  },
  
  // Helper function to rid the game of any miscreants
  bootMiscreants = function (message) {
    if (!leftGame) {
      leftGame = true;
      alert(message);
      window.location = "../../lobby";
    }
  },
  
  // Used once at the beginning to get the ball rolling, seeding the gamestate
  seedGamestate = function () {
    $.ajax({
      type: 'GET',
      url: '/gamestate/' + gameId,
      data: {
        player : userName
      },
      success: function (data) {
        if (!data) {
          bootMiscreants("You tried to access this game illegally. This incident has been reported.");
        }
        updateGamestate(data);
        console.log("initialize here! " + ktah.gamestate.monsters);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  },
  
//Generate a certain amount of zombies.
  generateMonsters = function(sceneNode, amount) {
    var monsterArray = [];    
    ktah.gamestate.monsters = [];
    console.log("generate here! " + ktah.gamestate.monsters);
    for (var i = 0; i < amount; i++) {
      monsterArray[i] = new ktah.types.BasicZombie({posX: (Math.random() * 1000) - 500, posZ: (Math.random() * 1000) - 500, lastZombie: (i === amount - 1)}
        ,{gameId: gameId, sceneNode: sceneNode});
      monsterArray[i].isZombie = true;
      monsterArray[i].walkSpeed = 1.0;
      // Want to add zombie collision with world here, but way too memory intensive right now or something
      // makes grass texture disappear and collision for player stop working
      //monsterArray[i].sceneNode.addAnimator(playerCollisionAnimator);
    }
    return monsterArray;
  },
  
  synchronizeMonsters = function(sceneNode) {
    $.ajax({
      type: 'GET',
      url: '/monsters/' + gameId,
      success: function (data) {
        var monsterArray = [];
        if(!data || (data && !data[data.length - 1].lastZombie)) {
          console.warn("in the TRUE!");
          setTimeout(function() {synchronizeMonsters(sceneNode);}, 200);
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
  },
  
  // Updates the positions of other players
  updateTeam = function () {
    // First, grab the gamestate
    $.ajax({
      type: 'GET',
      url: '/gamestate/' + gameId,
      data: {
        player : userName
      },
      success: function (data) {
        updatePlayers(data);
        
        // Update points
        $("#points-remaining").text(ktah.gamestate.players[playerNumber].pointsRemaining);
        
        // Update player positions based on the gamestate
        for (var i = 0; i < playerCount; i++) {
          var currentPlayer = ktah.gamestate.players[i],
              healthBarWidth = (currentPlayer.health / 100) * 148 + "px",
              currentAbilityQueue = ktah.gamestate.environment.abilityQueue[currentPlayer.name];
              
          // Update health bars
          $("#" + currentPlayer.name + "-health-num-box").children(":nth-child(2)")
            .text(currentPlayer.health + " / 100");
            
          $("#" + currentPlayer.name + "-health-bar")
            .css({width: healthBarWidth});
          
          // Set player animation
          if (currentPlayer.posX !== ktah.characterArray[i].sceneNode.Pos.X || currentPlayer.posZ !== ktah.characterArray[i].sceneNode.Pos.Z) {
            animateCharacter(i, "run");
          } else {
            animateCharacter(i, "stand");
          }
          
          // Set death animation
          if (currentPlayer.status === "dead") {
            ktah.characterArray[i].sceneNode.Rot.X = -80;
          }
          
          if (i === playerNumber) {
            // Render abilities if the player's individual queue has any
            if (currentAbilityQueue.length) {
              abilityList = currentAbilityQueue;
              ktah.abilities.renderAbilities(abilityList);
              // Remove rendered abilities from the abilityQueue
              $.ajax({
                type: 'POST',
                url: '/abilityDone/' + gameId + "/" + userName,
                data: JSON.stringify({count: abilityList.length}),
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                },
                dataType: 'json',
                contentType: 'application/json'
              });
            }
            
            currentPlayer.posX = ktah.characterArray[i].sceneNode.Pos.X;
            currentPlayer.posZ = ktah.characterArray[i].sceneNode.Pos.Z;
            currentPlayer.posY = ktah.characterArray[i].sceneNode.Pos.Y;
            currentPlayer.theta = ktah.characterArray[i].sceneNode.Rot.Y;
            
            if (ktah.characterArray[i].sceneNode.Pos.Y < -300 || resetKey) {
              currentPlayer.health = currentPlayer.health - 25;
              addPoints(-10);
              resetZombiePosition(i);
              currentPlayer.resetGoal();
              resetArrow();
              camFollow(cam, ktah.characterArray[i].sceneNode);
            }
            
            if (beingAttacked) {
              currentPlayer.health -= Math.ceil(1 * catchupRate);
              beingAttacked = false;
            }
            
            if (currentPlayer.health <= 0) {
              currentPlayer.health = 0;
              currentPlayer.status = "dead";
            }
            
            $.ajax({
              type: 'POST',
              url: '/gamestate/' + gameId + "/" + userName,
              data: JSON.stringify(currentPlayer),
              error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
              dataType: 'json',
              contentType: 'application/json'
            });
            
            // Make sure the "to" and "from" exist, and the "to" has enough room for all "from"s
            if (ktah.gamestate.monsters && ktah.monsterArray && ktah.monsterArray.length >= ktah.gamestate.monsters.length) {
              for (var j = 0; j < ktah.gamestate.monsters.length; j++) {
                // Zombies animated here if they move, regardless if host/client
                if ((ktah.monsterArray[j].sceneNode.Pos.X != ktah.gamestate.monsters[j].posX) || (ktah.monsterArray[j].sceneNode.Pos.Z != ktah.gamestate.monsters[j].posZ)) {
                  animateMonster(j, "walk");
                } else {
                  animateMonster(j, "look");
                }
              }
            }
            // Meaning they're the host...
            if (playerNumber === 0) {
              // *** testing to see if the monsters are being correctly updated.
              // console.warn("posx: " + ktah.gamestate.monsters[0].posX + "posz: " + ktah.gamestate.monsters[0].posX);
        	    $.ajax({
                type: 'POST',
                url: '/monsters/' + gameId,
                data: JSON.stringify(ktah.gamestate.monsters),
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                },
                dataType: 'json',
                contentType: 'application/json'
              });
            // Otherwise you're a client
            } else {
              // Make sure the "to" and "from" exist, and the "to" has enough room for all "from"s
              if (ktah.gamestate.monsters && ktah.monsterArray && ktah.monsterArray.length >= ktah.gamestate.monsters.length) {
              console.log("At least I'm trying to position the zombies!");
                for (var j = 0; j < ktah.gamestate.monsters.length; j++) {
                  console.log("Doin it once...");
                  ktah.monsterArray[j].sceneNode.Pos.X = ktah.gamestate.monsters[j].posX;
                  ktah.monsterArray[j].sceneNode.Pos.Z = ktah.gamestate.monsters[j].posZ;
                  ktah.monsterArray[j].sceneNode.Rot.Y = ktah.gamestate.monsters[j].rotY;
                }
              }
            }
          } else {
            ktah.characterArray[i].sceneNode.Pos.X = currentPlayer.posX;
            ktah.characterArray[i].sceneNode.Pos.Z = currentPlayer.posZ;
            ktah.characterArray[i].sceneNode.Pos.Y = currentPlayer.posY;
            ktah.characterArray[i].sceneNode.Rot.Y = currentPlayer.theta;
          }
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
  },
  
  // Function to check if everyone's DEAD... periodically
  gameEndCheck = function () {
    for (var i = 0; i < ktah.gamestate.players.length; i++) {
      var currentPlayer = ktah.gamestate.players[i];
      if (currentPlayer && currentPlayer.status === "alive") {
        return;
      }
    }
    // Otherwise, everyone's dead! End the game...
    gameOver = true;
    $("#end-dialog")
      .dialog({
        title: "Loading score...",
        width: 400,
        resizable: false,
        modal: true,
        show: 'fade'
      });
    setTimeout(function () {
      $.ajax({
        type: 'POST',
        url: '/score/' + gameId,
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
      window.location = "../../score/" + gameId;
    }, 6000);
  },
  
  // Function that periodically checks for players coming or going
  updatePlayers = function (data) {
    updateGamestate(data);
    if (typeof(data) === "undefined") {
      bootMiscreants("You've lost connection with the server!");
      return;
    }
    
    // Update the players if any have come or gone
    if (playerCount !== data.players.length) {
      updateCharacterArray(playerCount, false);
    }
  },
  
  resetZombiePosition = function(i){
    ktah.characterArray[i].sceneNode.Pos.Y = startingY;
    ktah.characterArray[i].sceneNode.Pos.X = startingX;
    ktah.characterArray[i].sceneNode.Pos.Z = startingZ;
  },
  
  resetArrow = function() {
    if (arrow) { arrow.Pos.Y = -1 * arrowHeight; } // hide arrow when reset
  },
  
  // Helper function for adding points
  addPoints = function (points) {
    var currentPlayer = ktah.gamestate.players[playerNumber];
    currentPlayer.pointsRemaining += points;
    currentPlayer.pointsEarned += points;
  },
  
  // Update catchupRate based on time passed
  updateCatchupRate = function(newTime) {
    if (catchupRateEnabled) {
	    if (newTime != lastTime) { // only update with a new timestamp
	      timeDiff = newTime - lastTime;
	      lastTime = newTime;
		 
	      // Add new diff to timeDiffs array
	      timeDiffs[timeDiffsCurrent] = timeDiff;
	      if (timeDiffsCurrent < timeDiffsTotal-1) { timeDiffsCurrent++; }
	      else { timeDiffsCurrent = 0; timeDiffsStartingUp = false; }
        
        // Then add all timeDiffs together to get the average
	      avgTimeDiff = 0.0;
	      if (timeDiffsStartingUp) { // while filling the list the first time
	        for (var i=0; i<timeDiffsCurrent; i++){
	          avgTimeDiff += timeDiffs[i];
	        }
	      } else { // if the list is full
	        for (x in timeDiffs) { avgTimeDiff += timeDiffs[x]; }
	      }
	      // Find the average
	      avgTimeDiff /= timeDiffsTotal;
	      // And apply it (in proportion to how often timeStamp was updated, and then counterbalanced
	      // to try and make the base catchupRate equal to one
	      catchupRate = avgTimeDiff/((timeLoopLength+1)*catchupCounterbalance);
	    }
	    
	    // If you want to see how various computers compare, just uncomment this line
	    // and watch the console log. It should reflect how much catchup is needed
	    // for the characters to appear as synced up  
      //console.log("catchupRate: " + catchupRate);

    } else {
      catchupRate = 1;
    }
  },

  // Don't need to check time every loop, can check occasionally
  timeLoop = function() {
    currentTime = (new Date()).getTime();
	//setTimeout(mainLoop, timeLoopLength);
  },
  
  mainLoop = function() {
	    
  	// Only check angle and movement if player exists and player is not dead
    if (playerSceneNode && (ktah.gamestate.players[playerNumber].health >= 1)) {
      var currentBeing = ktah.characterArray[playerNumber], //ktah.gamestate.players[playerNumber].character;
        monsters = ktah.gamestate.monsters;
      
      // Update the monsters targets, then move the monsters.
      // This is the "host loop"
      if (playerNumber === 0 && monsters) {
        for (var i = 0; i < ktah.monsterArray.length; i++) {
          
          // Brian Handy here, doing the same using my system...
          ktah.monsterArray[i].updateCatchupRate(catchupRate);
          ktah.monsterArray[i].huntClosest(ktah.characterArray);
          
          // Update gamestate to reflect zombie movement
          monsters[i].posX = ktah.monsterArray[i].sceneNode.Pos.X;
          monsters[i].posZ = ktah.monsterArray[i].sceneNode.Pos.Z;          
          monsters[i].rotY = ktah.monsterArray[i].sceneNode.Rot.Y;
          ktah.gamestate.monsters = monsters;
          
          // Collision Detection between AI / zombie and AI / zombie
          for (var j = i+1; j < ktah.monsterArray.length; j++) {
            if (ktah.monsterArray[j].sceneNode.Pos.getDistanceTo(ktah.monsterArray[i].sceneNode.Pos) < 8) {
              // Classic X/Z movement system
              ktah.monsterArray[j].sceneNode.Pos.X += (ktah.monsterArray[j].sceneNode.Pos.X - ktah.monsterArray[i].sceneNode.Pos.X)*1/9*catchupRate;
              ktah.monsterArray[j].sceneNode.Pos.Z += (ktah.monsterArray[j].sceneNode.Pos.Z - ktah.monsterArray[i].sceneNode.Pos.Z)*1/9*catchupRate;
            }
          }
          // Then check to see if you successfully have hit and pushed back the player
          if (ktah.characterArray[playerNumber].sceneNode.Pos.getDistanceTo(ktah.monsterArray[i].sceneNode.Pos) < 4) {
            // Classic X/Z movement system
            playerSceneNode.Pos.X += (playerSceneNode.Pos.X - ktah.monsterArray[i].sceneNode.Pos.X)*3/3;
            playerSceneNode.Pos.Z += (playerSceneNode.Pos.Z - ktah.monsterArray[i].sceneNode.Pos.Z)*3/3;
            beingAttacked = true;
            // Since moved, update the camera
            camFollow(cam, playerSceneNode);
            // TODO: Zombie attack animation (use animator method in place)
          }
        }
      }

      // First, ensure movement is in proportion to time passed
      if (timeLoopCurrent < timeLoopLength) {
        timeLoopCurrent++;
      } else {
        timeLoop();
        timeLoopCurrent=0;
      }
      updateCatchupRate(currentTime);//currentTime);
      
      // Check to make sure mouse is held down, not just clicked
      if (mouseIsDown) {
        if (mouseClicked) {
          mouseClickedTimer++;
          if (mouseClickedTimer > 10) {
            mouseClicked = false;
          }
        }
        whileMouseDown();
      }
      // If mouse held and released, stop immediately
      if ((!mouseIsDown && !mouseClicked) || (aKey || dKey || sKey || wKey)) {
    	currentBeing.resetGoal();
        resetArrow();
      } else if (currentBeing.getGoal() && arrow.Pos.Y > 0) {
        // not working as intended, but doings something that looks good!
        // should be making arrow rise and fall, instead it jumps between a high and low position
        arrow.Pos.Y = arrowHeight + arrowHeight * Math.sin(timeLoopCurrent/arrowHeight);
      }
      
      if (usingAbility) {
        useAbility(usingAbility);
        usingAbility = 0;
      }

      if (!cameraStarted) {
        camFollow(cam, playerSceneNode);
        cameraStarted = true;
      }
      var newX = 0.0;
      var newZ = 0.0;

      // Rotate Player based on Keyboard Combinations (8 directions)
      if (wKey || aKey || sKey || dKey) {
        var angle = 0;
        if (wKey && !sKey) {
          if (aKey && !dKey) {
            angle = 270-45;
          } else if (dKey && !aKey) {
            angle = 270+45;
          } else {
            angle = 270;
          }
        } else if (sKey && !wKey) {
          if (aKey && !dKey) {
            angle = 90+45;
          } else if (dKey && !aKey) {
            angle = 90-45;
          } else {
            angle = 90;
          }
        } else {
          if (aKey && !dKey) {
            angle = 180;
          } else if (dKey) {
            angle = 0;
    	  }
    	}
      	playerSceneNode.Rot.Y = angle + 45; // someday later, might also add in (if camera ever moves) this: + cam.Rot.Y;
      	// except that, apparently, cam.Rot values only return zero with the code we have right now.
      }
      
      // Update position and camera if any control changes made
      currentBeing.updateCatchupRate(catchupRate);
      currentBeing.updateStandState(standKey);
      if (aKey || wKey || dKey || sKey) {
        currentBeing.moveOnAngle(angle + 90);
      } else if (currentBeing.getGoal()) {
        currentBeing.moveToGoal();
        angle = currentBeing.getAngle();
      }
      if (aKey || wKey || dKey || sKey || currentBeing.getGoal()) {
        /* Still need to put in a system here to reset goal if player gets stuck */
       
        // Collision Detection between players
        for (var i = 0; i < playerCount; i++) {
          if (i !== playerNumber && ktah.characterArray[playerNumber].sceneNode.Pos.getDistanceTo(ktah.characterArray[i].sceneNode.Pos) < 4) {
            // Classic X/Z movement system
            playerSceneNode.Pos.X += (playerSceneNode.Pos.X - ktah.characterArray[i].sceneNode.Pos.X)/2;
            playerSceneNode.Pos.Z += (playerSceneNode.Pos.Z - ktah.characterArray[i].sceneNode.Pos.Z)/2;
          }
        }
        
        // Finally, update Camera for new positions
        camFollow(cam, playerSceneNode);
        
        // And show arrow if currentBeing dictates it
        if ((arrow.Pos.Y > 0) && (!currentBeing.getArrowVisible())) { // so if within range of goal, hide arrow
          arrow.Pos.Y = -1 * arrowHeight;
        }
      }
      
    }
    
    setTimeout(mainLoop, 20);
  };
  
  // Pass keydown to keyStateChange
  document.onkeydown = function(event) {
    key = String.fromCharCode(event.keyCode);
    keyStateChange(key, true);
  };
  // Pass keyup to keyStateChange
  document.onkeyup = function(event) {
    key = String.fromCharCode(event.keyCode);
    keyStateChange(key, false);
  };
  
  // Mouse Down register for Mouse Movement
  engine.handleMouseDown = function (event) { 
    mouseIsDown = true;
    mouseClicked = true;
    mouseClickedTimer = 0;
  };
  // Mouse Up register for Mouse Movement
  engine.handleMouseUp = function (event) {
    mouseIsDown = false;
  };
  
  // Mouse wheel for zooming
  // see http://plugins.jquery.com/project/mousewheel for more info
  // and http://plugins.jquery.com/plugin-tags/mousewheel
  // using the event helper from http://brandonaaron.net/code/mousewheel/docs
  $(document).mousewheel(function(event, delta) {
    if (zoomDist + zoomSpeed * delta <= zoomDistMax && zoomDist + zoomSpeed * delta >= zoomDistMin) {
      zoomDist += zoomSpeed * delta;
      camFollow(cam, playerSceneNode);
    }
  });
  
  // Now initialize the time variables
  currentTime = (new Date()).getTime();
  lastTime = currentTime;

  //timeLoop();
  mainLoop();
  
  // Set some error feedback for long loading / booting
  setTimeout(function () {
    $("#loading-screen-error").fadeIn(1000);
  }, 10000);
  
  // If a player leaves the room, remove them from the gamestate
  $(window).unload(function () {
    if (!gameOver) {
      $.ajax({
        type: 'GET',
        async: false,
        url: '/gamestate/' + gameId + "/" + userName,
        data: {
          player : userName
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
          dataType: 'json',
          contentType: 'application/json'
      });
      
      bootMiscreants("You have left the game! Returning to lobby...");
    }
  });
  
});
