/**
 * copperlicht-ui.js
 *
 * Contains the basic user-interaction elements
 * that copperlicht uses to update its display.
 */

$(function() {
  
  var engine = startCopperLichtFromFile('ktahCanvas', '../../assets/copperlicht/copperlichtdata/zombieTestRedux.ccbjs'),
  playerSceneNode = null,
  characterArray = [],
  scene = null,
  key = null;
  
  engine.addScene(scene);

  // Rate of how much to play catchup so stats applied equally
  var catchupRate = 1.0, catchupRateEnabled = true, lastTime = timeDiff = 0.0, currentTime,
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

  // Mouse Controls values
  goal = null, //new CL3D.Vect3d(),
  goalX = NaN, // where to travel to
  goalZ = NaN, // where to travel to
  originalX = NaN,
  originalZ = NaN,
  walkDist = 1.85, // how fast character moves

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

  // Variables for keyboard controls
  wKey = aKey = sKey = dKey = upKey = leftKey = downKey = rightKey = resetKey = jumpKey = standKey = false;

  // Universal Camera Setup
  var cam = new CL3D.CameraSceneNode();
  var animator = new CL3D.AnimatorCameraFPS(cam, engine);
  cam.addAnimator(animator);
  
  // Gameplay mechanics
  var zombieBeingAttacked = -1,
      gameId = $("#gameId").attr("data"),
      userName = $("#userName").attr("data"),
      playerNumber = 0,
      playerCount = 0,
      leftGame = false,
      
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
          nametagAccent = "";
          
          // Accent the nametag of the local player
          if (i === playerNumber) {
            nametagAccent = "class='currentPlayerNametag'";
          }
          
          // Setup health display
          $("#health-display").append(
            "<div id='" + currentPlayer.name + "-stats' class='player-stats'><div " + nametagAccent + ">" + currentPlayer.name + "</div>"
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
        var updatedCharacters = [];
        playerCount = ktah.gamestate.players.length;
        // Setup player information
        for (var i = 0; i < playerCount; i++) {
          // If it's the first setup, populate the array
          if (initialization) {
            if (ktah.gamestate.players[i].name === userName) {
              playerNumber = i;
            }
            
            if (i === 0) {
              // "Character 0" gets the original node
              characterArray[0] = scene.getSceneNodeFromName('soldier');
            } else {
              // All other characters are cloned and added to scene
              characterArray[i] = characterArray[0].createClone(scene.getRootSceneNode());
            }
            characterArray[i].playerName = ktah.gamestate.players[i].name;
            characterArray[i].playing = true;
            characterArray[i].Pos.Z += i * 15;
          // Otherwise, it's an update
          } else {
            // Reset all the "playing" tags of the scene nodes so that the ones that
            // no longer are active can be culled by process of elimination
            for (var k = 0; k < characterArray.length; k++) {
              characterArray[k].playing = false;
            }
            
            for (var j = 0; j < characterArray.length; j++) {
              // This lamely removes the player that left by adding the active ones
              // to a new, updated character array
              if (ktah.gamestate.players[i].name === characterArray[j].playerName) {
                updatedCharacters.push(characterArray[j]);
                updatedCharacters[updatedCharacters.length - 1].playerName = characterArray[j].playerName;
                updatedCharacters[updatedCharacters.length - 1].playing = characterArray[j].playing = true;
              }
            }
          }
        }
        
        // If this was a mid-game update, set the players back up
        if (!initialization) {
          // Nuke the "zombie" scene node (pun intended, just nuke the node the player left)
          for (var k = 0; k < characterArray.length; k++) {
            if (!characterArray[k].playing) {
              scene.getRootSceneNode().removeChild(characterArray[k]);
            }
          }
          // Now, set the characterArray to its updated form
          characterArray = updatedCharacters;
          // Now we have to reset the player numbers in the new array
          for (var i = 0; i < characterArray.length; i++) {
            if (updatedCharacters[i].playerName === userName) {
              playerNumber = i;
            }
          }
        }
        
        // Grab the character that the player is controlling
        playerSceneNode = characterArray[playerNumber];
        updateUserInterface();
      };

  // Called when loading the 3d scene has finished (from the coppercube file)
  engine.OnLoadingComplete = function () {
    var synchronizedUpdate = seedGamestate();
    
    if (ktah.gamestate.players) {
      scene = engine.getScene();
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
        //playerSceneNode.Pos.Y += 10;
      } else {
        return;
      }
      
      // Finish setting up by adding camera to scene
      scene.getRootSceneNode().addChild(cam);
      scene.setActiveCamera(cam);
      
      // Remove the loading screen
      $("#loadingScreen").fadeOut(3000);
      
      // ***** testing to make monsters! **********
      var protoGhoul = scene.getSceneNodeFromName('ghoul');
      
      var testMonster = new ktah.types.BasicZombie({posX: 20, posZ: 20},{gameId: gameId, scene: scene, sceneNode: protoGhoul}),
          testMonster1 = new ktah.types.BasicZombie({posX: 50, posZ: 50},{gameId: gameId, scene: scene, sceneNode: protoGhoul}),
          testMonster2 = new ktah.types.BasicZombie({posX: 30, posZ: 30},{gameId: gameId, scene: scene, sceneNode: protoGhoul});
      
      // Begin the server pinging
      setInterval(updateTeam, 50);
      // Kick any PHONIES from the game
      for (var i = 0; i < playerCount; i++) {
        if (userName === characterArray[i].playerName) {
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
    	case ' ':
    	  // "Jump forward is space"
    	jumpKey = bool;
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
  	  goal = newGoal;
  	  goalX = goal.X;
  	  goalZ = goal.Z;
        originalX = playerSceneNode.Pos.X;
        originalZ = playerSceneNode.Pos.Z;
  	}
  },
  
  updatePos = function(playerSceneNode, newX, newZ) {
    changeRate = 20;
    difX = (difX * (changeRate - 1) + newX) / changeRate;
    difZ = (difZ * (changeRate - 1) + newZ) / changeRate;
    camDistRatio = camSetDist / (Math.sqrt(Math.pow(difX, 2) + Math.pow(difZ, 2)));
  },
  
  // Helper function for animation display
  animateCharacter = function (characterIndex, animation) {
    var currentChar = characterArray[characterIndex];
    if (currentChar.currentAnimation !== animation) {
      currentChar.setLoopMode(animation !== "aim");
      if (currentChar.currentAnimation !== "aim") {
        currentChar.currentAnimation = animation;
        currentChar.setAnimation(animation);
      }
    }
    if (animation === "aim") {
      setTimeout(function () {currentChar.currentAnimation = "run";}, 600);
    }
  },
  
  // Helper function to store the asynchronous gamestate data
  updateGamestate = function (data) {
    ktah.gamestate = data;
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
          var currentPlayer = ktah.gamestate.players[i];
              
          // Update health bars
          $("#" + currentPlayer.name + "-health-num-box").children(":nth-child(2)")
            .text(currentPlayer.health + " / 100");
            
          $("#" + currentPlayer.name + "-health-bar")
            .css("width", (currentPlayer.health / 100) * 148 + "px");
          
          // Set zombie animation
          if (currentPlayer.posX !== characterArray[i].Pos.X || currentPlayer.posZ !== characterArray[i].Pos.Z) {
            animateCharacter(i, "run");
          } else {
            animateCharacter(i, "stand");
          }
          
          // Set attack animation
          if (currentPlayer.attacking !== -1) {
            animateCharacter(i, "aim");
          }
          
          if (i === playerNumber) {
            currentPlayer.posX = characterArray[i].Pos.X;
            currentPlayer.posZ = characterArray[i].Pos.Z;
            currentPlayer.posY = characterArray[i].Pos.Y;
            currentPlayer.theta = characterArray[i].Rot.Y;
            
            if (characterArray[i].Pos.Y < -300 || resetKey) {
              currentPlayer.health = currentPlayer.health - 25;
              addPoints(-10);
              resetZombiePosition(i);
              resetGoal();
              camFollow(cam, characterArray[i]);
            }
            
            if (jumpKey) {
              resetGoal();
              zombieJump(i);
              camFollow(cam, characterArray[i]);
            }
            
            currentPlayer.attacking = zombieBeingAttacked;
            
            if (currentPlayer.beingAttacked) {
              currentPlayer.health -= 5;
              currentPlayer.beingAttacked = false;
            }
            
            if (currentPlayer.health <= 0) {
              currentPlayer.health = 100;
              resetZombiePosition(i);
              camFollow(cam, characterArray[i]);
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
          } else {
            characterArray[i].Pos.X = currentPlayer.posX;
            characterArray[i].Pos.Z = currentPlayer.posZ;
            characterArray[i].Pos.Y = currentPlayer.posY;
            characterArray[i].Rot.Y = currentPlayer.theta;
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
  
  // Function that periodically checks for players coming or going
  updatePlayers = function (data) {
    updateGamestate(data);
    // Update the players if any have come or gone
    if (playerCount !== data.players.length) {
      updateCharacterArray(playerCount, false);
    }
  },
  
  // To move any node from position origin to position destination at walkDist
  goFromTo = function(origin, destination) {
    var newVal = 0;
    // Handle goalX if it has a new number
    if (destination != origin) {
      if (destination > origin + 1) {
        newVal += walkDist * catchupRate;
      } else if (destination < origin - 1) { 
        newVal -= walkDist * catchupRate;
      } else {
        destination = origin;
      }
    }
    return newVal;
  },
  
  resetZombiePosition = function(i){
      characterArray[i].Pos.Y = startingY;
      characterArray[i].Pos.X = startingX;
      characterArray[i].Pos.Z = startingZ;
  },
  
  zombieJump = function (i) {
    characterArray[i].Pos.X += 10;
    characterArray[i].Pos.Z += 10;
  },
  
  resetGoal = function() {
      goalX = null; //characterArray[i].Pos.X;
      goalZ = null; //characterArray[i].Pos.Z;
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
    if (playerSceneNode) {

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
        resetGoal();
    	  //goalX = playerSceneNode.Pos.X;
        //goalZ = playerSceneNode.Pos.Z;
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
      
      // Reset attack value
      zombieBeingAttacked = -1;
      
      // Update position and camera if any changes made
      if(goalX || goalZ || aKey || wKey || dKey || sKey) {
        if (!goalX && !goalZ) { // if Keyboard Commands, just update dirAngle
          dirAngle = (270 - playerSceneNode.Rot.Y) / 180 * Math.PI;
          // if Mouse, update rotation of player character appropriately
        } else if (goal && playerSceneNode.Pos.getDistanceTo(new CL3D.Vect3d(goal.X, playerSceneNode.Pos.Y,goal.Z)) > 3*walkDist) {
          dirAngle = Math.atan((goalZ - originalZ) / (goalX - originalX));
          if (goalX > playerSceneNode.Pos.X) { dirAngle = Math.PI + dirAngle; }
          playerSceneNode.Rot.Y = 270 - dirAngle * 180 / Math.PI; // dirAngle must be converted into 360
        }

        newX = newZ = 0; // reset so we can recalculate based on new angle
        newX -= walkDist * Math.sin(Math.PI/2 + dirAngle) * catchupRate;
        newZ += walkDist * Math.cos(Math.PI/2 + dirAngle) * catchupRate;
        // so this calculates the new X and new Z twice, but this one makes it right to the facing angle
        
        if ((!goalX && !goalZ) || (goal && playerSceneNode.Pos.getDistanceTo(new CL3D.Vect3d(goal.X, playerSceneNode.Pos.Y,goal.Z)) > 2*walkDist)) {
          if (!standKey) {
            playerSceneNode.Pos.X += newX;
            playerSceneNode.Pos.Z += newZ;
          }
        }
        
        // Collision Detection between zombies
        for (var i = 0; i < playerCount; i++) {
          if (i !== playerNumber && characterArray[playerNumber].Pos.getDistanceTo(characterArray[i].Pos) < 4) {
            // Classic X/Z movement system
            playerSceneNode.Pos.X += (playerSceneNode.Pos.X - characterArray[i].Pos.X)/2;
            playerSceneNode.Pos.Z += (playerSceneNode.Pos.Z - characterArray[i].Pos.Z)/2;
            zombieBeingAttacked = i;
          }
        }
        
        updatePos(playerSceneNode, newX, newZ);
        
        // Finally, update Camera for new positions
        camFollow(cam, playerSceneNode);
        
        // DELETEME logging to figure out bug with collision detection
        console.log("Player y is " + playerSceneNode.Pos.Y);
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
  
  // If a player leaves the room, remove them from the gamestate
  $(window).unload(function () {
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
    if (!leftGame) {
      bootMiscreants("You have left the game! Returning to lobby...");
    }
  });
  
});
