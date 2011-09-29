/**
 * copperlicht-ui.js
 *
 * Contains the basic user-interaction elements
 * that copperlicht uses to update its display.
 */

$(function() {

  var engine = startCopperLichtFromFile('ktahCanvas', '../../assets/copperlicht/copperlichtdata/zombieTest.ccbjs'),
  zombieSceneNode = null,
  scene = null,
  key = null;
  
  engine.addScene(scene);

  // Rate of movement per second
  var moveRate = 1.0, lastTime = 0.0, timeDiff = 0.0,

  // Camera positioning values
  camSetDist = 10, camDistRatio = 1.0,

  // Last direction travelled
  difX = -1.0, difZ = 0.0, dirAngle = 0.0,

  // Camera positioning values
  camSetDist = 10,
  camDistRatio = 1.0,
  zoomDist = 10,
  zoomDistMin = -3,
  zoomDistMax = 15,
  zoomSpeed = -2,
  isometricView = true,
  cameraStarted = false,

  // Variables for keyboard controls
  wKey = aKey = sKey = dKey = false, upKey = leftKey = downKey = rightKey = false;

  // Universal Camera Setup
  var cam = new CL3D.CameraSceneNode();
  var animator = new CL3D.AnimatorCameraFPS(cam, engine);
  cam.addAnimator(animator);

  // Called when loading the 3d scene has finished (from the coppercube file)
  engine.OnLoadingComplete = function() {
    scene = engine.getScene();
    if(scene) {
      // Grab the zombieSceneNode scene node
      zombieSceneNode = scene.getSceneNodeFromName('ghoul');
    } else {
      return;
    }

    // Finish setting up by adding camera to scene
    scene.getRootSceneNode().addChild(cam);
    scene.setActiveCamera(cam);
  }
  // Default camera commands
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
    camAnimator.lookAt(new CL3D.Vect3d(zombieSceneNode.Pos.X, zombieSceneNode.Pos.Y + 10, zombieSceneNode.Pos.Z));
  }
  // A more complicated keydown event. Uppercase and lowercase
  // letters referenced due to keydown vs keypress differences
  document.onkeydown = function(event) {
    key = String.fromCharCode(event.keyCode);

    // Displays key value, for learning new key cases
    // alert(key);
    // When pressing w, move forward, s back
    // a move left, d move right
    switch (key) {
      case 'w':
      case 'W':
      case '&':
        // up arrow
        wKey = true;
        break;
      case 's':
      case 'S':
      case '(':
        // down arrow
        sKey = true;
        break;
      case 'a':
      case 'A':
      case '%':
        // left arrow
        aKey = true;
        break;
      case 'd':
      case 'D':
      case "'":
        // right arrow
        dKey = true;
        break;
      default:
        break;
    }
  }
  // Set up simple example keydown event
  document.onkeyup = function(event) {
    key = String.fromCharCode(event.keyCode);

    // When pressing w, move forward, s back
    // a move left, d move right
    switch (key) {
      case 'w':
      case 'W':
      case '&':
        wKey = false;
        break;
      case 's':
      case 'S':
      case '(':
        sKey = false;
        break;
      case 'a':
      case 'A':
      case '%':
        aKey = false;
        break;
      case 'd':
      case 'D':
      case "'":
        dKey = false;
        break;
      default:
        break;
    }
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
  mainLoop = function() {
    // Timing stuff to make movement independent of framerate, WIP
    //var secs = (new Date());
    //timeDiff = secs - lastTime;
    //lastTime = secs;
    if(zombieSceneNode) {

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
      // Update position and camera if any changes made
      if(newX != 0.0 || newZ != 0.0) {
        dirAngle = Math.tan(difZ / difX);
        updatePos(zombieSceneNode, newX, newZ);

        // Classic X/Z movement system
        zombieSceneNode.Pos.X += newX;
        //moveRate * timeDiff;
        zombieSceneNode.Pos.Z += newZ;
        //moveRate * timeDiff;
        // Experimental alternative movement system, WIP
        //zombieSceneNode.Pos.X += newX * Math.sin(dirAngle) + newZ * Math.cos(Math.PI / 2 - dirAngle);//moveRate * timeDiff;
        //zombieSceneNode.Pos.Z += newX * Math.cos(Math.PI / 2 - dirAngle) +  newX * Math.sin(dirAngle);//moveRate * timeDiff;
        // Finally, update Camera for new positions
        camFollow(cam, zombieSceneNode);
      }

    }

    setTimeout('mainLoop();', 20);
  }
  // Timing stuff to make movement independent of framerate, WIP
  //var secs = (new Date()).getSeconds();
  mainLoop()
  
});
