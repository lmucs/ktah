/**
 * copperlicht-ui.js
 *
 * Contains the basic user-interaction elements
 * that copperlicht uses to update its display.
 */

$(function() {

  var engine = startCopperLichtFromFile('ktahCanvas', '../../assets/copperlicht/copperlichtdata/zombieTestRedux.ccbjs'),
  zombieSceneNode = null,
  zombieArray = [],
  scene = null,
  key = null;
  
  engine.addScene(scene);

  // Rate of movement per second
  var moveRate = 1.0, lastTime = 0.0, timeDiff = 0.0,

  // Camera positioning values
  camSetDist = 10, camDistRatio = 1.0,

  // Last direction travelled
  difX = -1.0, difZ = 0.0, dirAngle = 0.0,

  // Mouse Controls values
  goalX = NaN, // where to travel to
  goalZ = NaN, // where to travel to
  originalX = NaN,
  originalZ = NaN,
  engWidth = 640, // width of clickable area
  engHeight = 480, // height of clickable area
  mouseToDist = 25, // conversion ratio for mouse units to ingame distance units
  walkSpeed = 1.0, // how fast character moves

  // Camera positioning values
  camSetDist = 10,
  camDistRatio = 1.0,
  zoomDist = 10,
  zoomDistMin = -3,
  zoomDistMax = 15,
  zoomSpeed = -2,
  isometricView = true,
  cameraStarted = false,
  mouseIsDown = false,
  mouseClicked = false,
  mouseClickedTimer = 0,

  // Variables for keyboard controls
  wKey = aKey = sKey = dKey = false, upKey = leftKey = downKey = rightKey = false;

  // Universal Camera Setup
  var cam = new CL3D.CameraSceneNode();
  var animator = new CL3D.AnimatorCameraFPS(cam, engine);
  cam.addAnimator(animator);

  // TODO: These function declarations need to be listed with comma separation
  
  // Called when loading the 3d scene has finished (from the coppercube file)
  engine.OnLoadingComplete = function() {
    scene = engine.getScene();
    if(scene) {
      // Setup player information
      for (var i = 0; i < ktah.gamestate.players.length; i++) {
        if (ktah.gamestate.players[i].name === userName) {
          playerNumber = i;
        }
        playerCount++;
      }
      
      // TEMPORARY: Populate the zombieArray, one for each player
      for (var i = 0; i < playerCount; i++) {
        if (i === 0) {
          // "Zombie 0" gets the original ghoul
          zombieArray[0] = scene.getSceneNodeFromName('ghoul');
        } else {
          // All other zombies are cloned and added to scene
          zombieArray[i] = zombieArray[0].createClone(scene.getRootSceneNode());
        }
        zombieArray[i].Pos.X += i * 15;
      }
      // Grab the zombie that the player is controlling
      zombieSceneNode = zombieArray[playerNumber];
    } else {
      return;
    }

    // Finish setting up by adding camera to scene
    scene.getRootSceneNode().addChild(cam);
    scene.setActiveCamera(cam);
    
    // Lastly, set the update function
    window.setInterval(updateTeam, 50);
  }
  // Default camera instructions
  camFollow = function(cam, target) {
    if (isometricView) {
      isometricCam(cam, target);
    } else {
      shoulderCam(cam, target);
    }
  }
  // Over the shoulder camera
  shoulderCam = function(cam, target) {
    cam.Pos.X = target.Pos.X - difX * camDistRatio;
    cam.Pos.Y = target.Pos.Y + 20;
    cam.Pos.Z = target.Pos.Z - difZ * camDistRatio;
    animator.lookAt(new CL3D.Vect3d(zombieSceneNode.Pos.X, zombieSceneNode.Pos.Y + 10, zombieSceneNode.Pos.Z));
  }
  // Isometric camera
  isometricCam = function(cam, target) {
    cam.Pos.X = target.Pos.X + (camSetDist + zoomDist);
    cam.Pos.Y = target.Pos.Y + (camSetDist + 2*zoomDist  + 10);
    cam.Pos.Z = target.Pos.Z - (camSetDist + zoomDist);
    animator.lookAt(new CL3D.Vect3d(zombieSceneNode.Pos.X, zombieSceneNode.Pos.Y + 10, zombieSceneNode.Pos.Z));
  }
  // Pass keydown to keyStateChange
  document.onkeydown = function(event) {
    key = String.fromCharCode(event.keyCode);
    keyStateChange(key, true);
  }
  // Pass keyup to keyStateChange
  document.onkeyup = function(event) {
    key = String.fromCharCode(event.keyCode);
    keyStateChange(key, false);
  }
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
      default:
        break;
    }
  }
  // Mouse Down register for Mouse Movement
  engine.handleMouseDown = function (event) { 
    mouseIsDown = true;
    mouseClicked = true;
    mouseClickedTimer = 0;
  }
  // Mouse Up register for Mouse Movement
  engine.handleMouseUp = function (event) {
    mouseIsDown = false;
  }
  whileMouseDown = function() {
    var changeX = 2*((engine.getMouseDownX() - engWidth/2) / (engWidth/2));
    var changeY = -2*((engine.getMouseDownY() - engHeight/2) / (engHeight/2));
    var changeHyp = Math.sqrt(Math.pow(changeX,2) + Math.pow(changeY,2));
    var theta = Math.atan(changeY / changeX);
    var rotatedX = changeHyp * Math.sin(theta + Math.PI*5/4);
    var rotatedY = changeHyp * Math.cos(theta + Math.PI*5/4);
    if (changeX > 0) { rotatedX = -1*rotatedX; }
    if (changeX > 0) { rotatedY = -1*rotatedY; }
    goalX = zombieSceneNode.Pos.X + rotatedY * mouseToDist;
    goalZ = zombieSceneNode.Pos.Z + rotatedX * mouseToDist;
    originalX = zombieSceneNode.Pos.X;
    originalZ = zombieSceneNode.Pos.Z;
    console.log(theta);
  }
  // Mouse wheel for zooming
  // see http://plugins.jquery.com/project/mousewheel for more info
  // and http://plugins.jquery.com/plugin-tags/mousewheel
  // using the event helper from http://brandonaaron.net/code/mousewheel/docs
  $(document).mousewheel(function(event, delta) {
    if (zoomDist + zoomSpeed * delta <= zoomDistMax && zoomDist + zoomSpeed * delta >= zoomDistMin) {
      zoomDist += zoomSpeed * delta;
      camFollow(cam, zombieSceneNode);
    }
  });
  updatePos = function(zombieSceneNode, newX, newZ) {
    changeRate = 20;
    difX = (difX * (changeRate - 1) + newX) / changeRate;
    difZ = (difZ * (changeRate - 1) + newZ) / changeRate;
    camDistRatio = camSetDist / (Math.sqrt(Math.pow(difX, 2) + Math.pow(difZ, 2)));
  }
  
  // Updates the positions of other players
  updateTeam = function() {
    getGamestate();
    
    // Update player positions based on the gamestate
    for (var i = 0; i < playerCount; i++) {
      var currentPlayer = ktah.gamestate.players[i];
      if (i === playerNumber) {
        currentPlayer.posX = zombieArray[i].Pos.X;
        currentPlayer.posZ = zombieArray[i].Pos.Z;
        currentPlayer.theta = zombieArray[i].Rot.Y;
        if (zombieArray[i].Pos.Y < -300) {
          alert("You have fallen to a rocky death. Click OK to respawn.");
          zombieArray[i].Pos.Y = 1.4;
          zombieArray[i].Pos.X = 64.4;
          zombieArray[i].Pos.Z = 118.4;
        }
        postGamestate(currentPlayer);
      } else {
        zombieArray[i].Pos.X = currentPlayer.posX;
        zombieArray[i].Pos.Z = currentPlayer.posZ;
        zombieArray[i].Rot.Y = currentPlayer.theta;
      }
    }
  }
  
  // To move any node from position origin to position destination at walkspeed
  goFromTo = function(origin, destination) {
    var newVal = 0;
    // Handle goalX if it has a new number
    if (destination != origin) {
      if (destination > origin + 1) {
        newVal += walkSpeed;
      } else if (destination < origin - 1) { 
        newVal -= walkSpeed;
      } else {
        destination = origin;
      }
    }
    return newVal;
  }
  mainLoop = function() {
    if(zombieSceneNode) {

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
      if (!mouseIsDown && !mouseClicked) {
        goalX = zombieSceneNode.Pos.X;
        goalZ = zombieSceneNode.Pos.Z;
      }

      if (!cameraStarted) {
        camFollow(cam, zombieSceneNode);
        cameraStarted = true;
      }
      var newX = 0.0;
      var newZ = 0.0;

      if(wKey) {
        newX -= 1.0;
        zombieSceneNode.Rot.Y = 270; //out of 360
      }
      if(sKey) {
        newX += 1.0;
        zombieSceneNode.Rot.Y = 90; //out of 360
      }
      if(aKey) {
        newZ -= 1.0;
        zombieSceneNode.Rot.Y = 180; //out of 360
      }
      if(dKey) {
        newZ += 1.0;
        zombieSceneNode.Rot.Y = 0; //out of 360
      }
      // Try also to 
      newX += goFromTo(zombieSceneNode.Pos.X, goalX);
      newZ += goFromTo(zombieSceneNode.Pos.Z, goalZ);
      // Update position and camera if any changes made
      if(newX != 0.0 || newZ != 0.0) {
        if (goalX == zombieSceneNode.Pos.X && goalZ == zombieSceneNode.Pos.Z) {
          dirAngle = Math.atan(difZ / difX);
        } else {
          dirAngle = Math.atan((goalZ - originalZ) / (goalX - originalX));
          if (goalX > zombieSceneNode.Pos.X) { dirAngle = Math.PI + dirAngle; }
          zombieSceneNode.Rot.Y = 270 - dirAngle * 180 / Math.PI; // dirAngle must be converted into 360
          // Classic X/Z movement system
          newX -= walkSpeed * Math.sin(Math.PI/2 + dirAngle);
          newZ += walkSpeed * Math.cos(Math.PI/2 + dirAngle);
        }
        
        zombieSceneNode.Pos.X += newX;
        zombieSceneNode.Pos.Z += newZ;
        
        for (var i = 0; i < playerCount; i++) {
          if (i !== playerNumber && zombieArray[playerNumber].Pos.getDistanceTo(zombieArray[i].Pos) < 4) {
            // Classic X/Z movement system
            zombieSceneNode.Pos.X -= newX;
            zombieSceneNode.Pos.Z -= newZ;
          }
        }
        
        updatePos(zombieSceneNode, newX, newZ);
        
        // Update the position of the other zombies

        // TODO: Should this be in the main loop?
        // Finally, update Camera for new positions
        camFollow(cam, zombieSceneNode);
      }
      
    }

    setTimeout('mainLoop();', 20);
  }
  mainLoop()
  
});
