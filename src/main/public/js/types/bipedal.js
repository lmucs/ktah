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
		  sceneNode: null,
		  angle: 0,
		  catchup: 0,
		  standState: false,
		  arrowVisible: false,
		  isZombie: false,
		  walkSpeed: 1.0
    },
    
    // Update with a new goal, can be used for zombie's target system
    setGoal: function (newGoal) {
    	this.goal = newGoal;
    	this.original = this.sceneNode.Pos;
    },
    getGoal: function () {
    	return this.goal;
    },
    // in case someone tries to use update instead of set, it does the same thing
    updateGoal: function (newGoal) {
      this.setGoal(newGoal);
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
    
    getPos: function () {
      return this.sceneNode ? this.sceneNode.Pos : null;
    },
    
    setPos: function (newPos) {
      if (this.sceneNode) {
        this.sceneNode.Pos = newPos;
      }
    },
    
    getAngle: function () {
      return this.angle;
    },
    getNodeAngle: function () {
      return this.sceneNode.Rot.Y;
    },
    
    getArrowVisible: function () {
      return this.arrowVisible;
    },
    
    setIsZombie: function (bool) {
      this.isZombie = bool;
    },
    // How much catching up must be done in movement to accomodate lag
    updateCatchupRate: function (newCatchup) {
      this.catchup = newCatchup;
    },
    // Boolean to represent if standing still *while trying to move*, or moving freely
    updateStandState: function (newStand) {
      this.standState = newStand;
    },
    
    withinRange: function () {
      if (this.goal && this.sceneNode) {
        return !(this.sceneNode.Pos.getDistanceTo(new CL3D.Vect3d(this.goal.X, this.sceneNode.Pos.Y,this.goal.Z)) > 2*this.walkSpeed);
      } else { // not really sure what to do if we can't evaluate, so...
        return null;
      }
    },
    
    move: function (newAngle) {
      // Then see if there's a new angle being given for directional movement (not goal movement)
      if (newAngle) { this.angle = (270 - newAngle + 45) / 180 * Math.PI; }
      
      // Then try goal movement
      if (this.goal && !newAngle) {
        this.angle = Math.atan((this.goal.Z - this.sceneNode.Pos.Z) / (this.goal.X - this.sceneNode.Pos.X))
        if (this.goal.X > this.sceneNode.Pos.X) { this.angle = Math.PI + this.angle; }
      }
      this.angle += Math.PI; // correction for Copperlicht's system
      this.sceneNode.Rot.Y = 90 - this.angle * 180 / Math.PI; // then rotate node appropriately
      
      // Finally, only move if not trying to stand still AND you're not too close
      if ((!this.standState) && (!this.withinRange())) {
        this.sceneNode.Pos.X += Math.cos(this.angle) * this.walkSpeed * this.catchup;
        this.sceneNode.Pos.Z += Math.sin(this.angle) * this.walkSpeed * this.catchup;
      } else if (this.arrowVisible) {
        this.arrowVisible = false;
      }
    },
    
    moveOnAngle: function (newAngle) {
      this.move(newAngle);
      this.arrowVisible = false;
    },
    
    moveToGoal: function () {
      // Do not try to go to goal if within range already
      this.move(null);
      if (this.goal && !this.withinRange()) {
        this.arrowVisible = true;
      } else {
        this.arrowVisible = false;
      }
    },
    
    versionNumber: function() {
    	console.log("Running version 06");
    }
    
  });
});