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
    var resource = new ktah.types.Resource({resourceType: options.resourceType, posX: x, posZ: z, id: options.resourceId},
          {sceneNode: ktah.scene.getSceneNodeFromName(options.resourceType)});
  };
  
  ktah.resources.resourceAcquired = function (resourceId) {
    // POST to the gamestate that client picked up a resource
  };
  
});
