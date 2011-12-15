/**
 * resources.js
 *
 * Handles resource creation and collection
 */

$(function () {
  
  // Set up the present resources array in ktah.resources
  ktah.resources.resourcesPresent = [];
  
  // Used by each player to see an ability used
  ktah.resources.renderResource = function (resourceInfo) {
    // Host has created a resource that client should render
  };
  
  ktah.resources.resourceAcquired = function (resourceId) {
    // POST to the gamestate that client picked up a resource
  }
  
});
