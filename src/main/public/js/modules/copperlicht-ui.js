/**
 * copperlicht-ui.js
 *
 * Contains the basic user-interaction elements
 * that copperlicht uses to update its display.
 */

$(function () {
        
    // Begin by setting up the canvas element
    var engine = startCopperLichtFromFile('game', '../../assets/copperlicht/copperlichtdata/zombieTest.ccbjs'),
        zombieSceneNode = null,
        scene = null,
        key = null;
    
    // Called when loading the 3d scene has finished (from the coppercube file)
    engine.OnLoadingComplete = function () {
        scene = engine.getScene();
        if (scene) {
            // Grab the zombieSceneNode scene node
            zombieSceneNode = scene.getSceneNodeFromName('ghoul');
        }
    }
    
    // Next, bind the keypress event to the canvas object
    $("game").keypress(function (event) {
        key = String.fromCharCode(event.keyCode);
        
        // When pressing w, move forward, s back
        // a move left, d move right
        switch (key) {
            case 'w':
                zombieSceneNode.Pos.X -= 1;
                break;
            case 's':
                zombieSceneNode.Pos.X += 1;
                break;
            case 'a':
                zombieSceneNode.Pos.Z -= 1;
                break;
            case 'd':
                zombieSceneNode.Pos.Z += 1;
                break;
            default:
                break;
         }
    });
    
    // Import the script linearly
    ktah.utils.include();
});