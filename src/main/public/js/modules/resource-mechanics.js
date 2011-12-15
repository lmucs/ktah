/**
 * resources.js
 *
 * Handles resource creation and collection
 */

$(function () {
  
  // Set up the present resources array in ktah.resources
  ktah.resources.resourcesPresent = [];
  
  // Called periodically by the host to create a new resource
  ktah.resources.createResource = function (resourceId, resourceType) {
    ktah.abilities.postAbilityUse("spawnResource", "host", (Math.random() * 1000) - 500, 1.3, (Math.random() * 1000) - 500, Math.random() * 2 * Math.PI, 60, 
      {"id": resourceId, "resourceType": resourceType});
  };
  
  // Used by each player to see an ability used
  ktah.resources.renderResource = function (caster, x, y, z, theta, cooldown, options) {
    // Host has created a resource that everyone should render
    var resourceSpawned = new ktah.types.Resource({resourceType: options.resourceType, posX: x, posZ: z, id: options.resourceId},
          {sceneNode: ktah.scene.getSceneNodeFromName(options.resourceType)});
    ktah.resources.resourcesPresent.push(resourceSpawned);
    
    // Set a timeout for resources that are inaccessible or neglected
    setTimeout(function() {
      
    }, cooldown * 500);
  };
  
  // Runs through collision with resources
  ktah.resources.checkForResourcePickup = function (playerNumber) {
    resourcesPresent = ktah.resources.resourcesPresent;
    for (var i = 0; i < resourcesPresent.length; i++) {
      if (ktah.characterArray[playerNumber].sceneNode.Pos.getDistanceTo(resourcesPresent[i].sceneNode.Pos) < 7) {
        ktah.resources.consumeResource(playerNumber, resourcesPresent[i].resourceType, resourcesPresent[i].id);
      }
    }
    setTimeout(function() {
      ktah.resources.checkForResourcePickup(playerNumber);
    }, 1000);
  };
  
  // Use the ability framework again to remove the resource for everyone else
  ktah.resources.consumeResource = function (playerNumber, resourceType, resourceId) {
    ktah.abilities.postAbilityUse("consumeResource", "host", 0, 1.3, 0, 0, 60, 
      {"id": resourceId, "resourceType": resourceType});
    
    var currentCharacter = ktah.characterArray[playerNumber],
        currentResource = currentCharacter.resources[resourceType];
    
    if (resourceType === "medKit") {
      currentCharacter.health += 10 + Math.floor((Math.random() * 10));
    } else {
      // See how to parse the resource a character just received
      if (typeof(currentResource) !== "undefined" && currentResource < 3) {
        ktah.characterArray[playerNumber].resources[resourceType] += 1;
      } else if (currentCharacter.resources.expertise < 100) {
        currentCharacter.resources.expertise = Math.min(currentCharacter.resources.expertise + 20, 100);
      }
    }
    ktah.util.queuedPoints += 15;
    ktah.resources.updateResourceUI(playerNumber);
  };
  
  // Performs the clean-up for a consumed resource
  ktah.resources.removeResource = function (caster, x, y, z, theta, cooldown, options) {
    resourcesPresent = ktah.resources.resourcesPresent;
    for (var i = 0; i < resourcesPresent.length; i++) {
      if (resourcesPresent[i].id === options.id) {
        ktah.scene.getRootSceneNode().removeChild(resourcesPresent[i].sceneNode);
        resourcesPresent.splice(i, 1);
        return;
      }
    }
  };
  
  // Updates the UI reporting of player resources
  ktah.resources.updateResourceUI = function (playerNumber) {
    var currentCharacter = ktah.characterArray[playerNumber],
        progressBarValue;
    for (var currentResource in currentCharacter.resources) {
      progressBarValue = currentCharacter.resources[currentResource];
      if (currentResource !== "expertise") {
        progressBarValue = (progressBarValue / 3) * 100;
      }
      $("#" + currentResource + "-container")
        .children()
        .last()
        .html(currentCharacter.resources[currentResource] + "")
        .prev()
        .progressbar("value", progressBarValue);
    }
  }
  
});
