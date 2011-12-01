/**
 * bipedal.js
 *
 * The abstract type of all characters and monsters.
 */

$(function () {
  ktah.types.Bipedal = Backbone.Model.extend({
	  defaults: {
		  goal: null, // where to travel to
		  original: null, // where we once were
/* worked before I commented out this block
	      // Public properties
	      name: "",
	      characterClass: null,
	      id: null,
	      level: 1,
	      health: 100, // TODO: Arbitrary placeholder
	      sceneNode: null,
	      
	      type: 'monster',
	      posX: 0,
	      posZ: 0,
	      sceneNode: null,
	      target: 0 //not sure if we need this here, since target is a result of
	                //current position and positions of other zombies and
	                //humans, which are very dynamic*/
	    },
    // was working before I added this section
    // Update with a new goal, can be used for zombie's target system
    updateGoal: function (newGoal) {
    	this.goal = newGoal;
    	this.original = this.sceneNode.Pos;
        console.log("updateGoal called!");
    },
    getGoal: function () {
    	return this.goal;
    },


    getGoalX: function () {
    	return this.goal ? this.goal.X : null;
    },
    getGoalZ: function () {
    	return this.goal ? this.goal.Z : null;
    },
    getOriginalX: function () {
    	return this.original ? this.original.X : null;
    },
    getOriginalZ: function () {
    	return this.original ? this.original.Z : null;
    },

    resetGoal: function () {
    	this.goal = null;
    },
    
    versionNumber: function() {
    	console.log("Running version 04");
    }
    
  });
});
