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
		  walkSpeed: 1.0,
		  currentSpeed: 1.0,
		  moved: false,
		  closest: null,
		  closestNum: null,
		  closestDist: null
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

    // Hunt down the closest node in array, and return its Pos    
    findClosest: function (array) {
      var closest = array[0].sceneNode.Pos,
          closestNum = 0,
          closestDist = this.sceneNode.Pos.getDistanceTo(array[0].sceneNode.Pos);
      for (var i = 0; i < array.length; i++) {
        if (array[i] && array[i].sceneNode) {
          var newDist = this.sceneNode.Pos.getDistanceTo(array[i].sceneNode.Pos);
          if (newDist < closestDist && array[i].isAlive) {
            closest = array[i].sceneNode.Pos;
            closestNum = i;
            closestDist = newDist;
          }
        }
      }
      this.closest = closest;
      this.closestNum = closestNum;
      this.closestDist = closestDist;
    },
    
    // Find closest and set as target
    huntClosest: function (array) {
      this.findClosest(array)
      this.setGoal(this.closest);
      this.moveToGoal();
    },
    
    move: function (newAngle) {
      // in case it doesn't exist
      if (!this.currentSpeed) { this.currentSpeed = this.walkSpeed;}
      
      var oldX = this.sceneNode.Pos.X;
      var oldZ = this.sceneNode.Pos.Z;
      
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
        this.sceneNode.Pos.X += Math.cos(this.angle) * this.currentSpeed * this.catchup;
        this.sceneNode.Pos.Z += Math.sin(this.angle) * this.currentSpeed * this.catchup;
      } else if (this.arrowVisible) {
        this.arrowVisible = false;
      }
      
      // Keep track of if your X or Z has changed in this move
      if (this.standState === true || this.standState === false) { // because sometimes standState is undefined now?
        this.moved = !this.standState && ((this.sceneNode.Pos.X !== oldX) || (this.sceneNode.Pos.Z !== oldZ));
      } else {
        this.moved = ((this.sceneNode.Pos.X !== oldX) || (this.sceneNode.Pos.Z !== oldZ));
      }
      
      // Reset currentSpeed at end of every movement, expecting movements only after collision with effect checks
      this.currentSpeed = this.walkSpeed;
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
    
    // Expects an array full of sceneNodes
    checkCollision: function(array, dist, bounceRatio) {
      // Make sure catchup exists
      if (!this.catchup) {this.catchup = 1;}
      if (!bounceRatio) { bounceRatio = 1/9; }
      
      // Make sure it's in array form
      if (array.constructor.toString().indexOf("Array") === -1) { array = [array]; }
      
      // Return value
      var hitSomething = false;
      
      // Collision Detection between self and anything in the array
      for (var j = 0; j < array.length; j++) {
        if (array[j].sceneNode.Pos.getDistanceTo(this.sceneNode.Pos) < dist) {
          // Classic X/Z movement system
          array[j].sceneNode.Pos.X += (array[j].sceneNode.Pos.X - this.sceneNode.Pos.X)*bounceRatio*this.catchup;
          array[j].sceneNode.Pos.Z += (array[j].sceneNode.Pos.Z - this.sceneNode.Pos.Z)*bounceRatio*this.catchup;
          this.sceneNode.Pos.X -= (array[j].sceneNode.Pos.X - this.sceneNode.Pos.X)*bounceRatio*this.catchup;
          this.sceneNode.Pos.Z -= (array[j].sceneNode.Pos.Z - this.sceneNode.Pos.Z)*bounceRatio*this.catchup;
          hitSomething = true;
        }
      }
      return hitSomething;
    },
    
    hitEffect: function (effect) {
      this.defaultHitEffect(effect);
    },

    // regardless of character/monster, what usually happens when you hit an effect    
    defaultHitEffect: function (effect) {
      switch(effect.getName()){ // returns in single quotation marks
        case 'path':
          this.currentSpeed = this.walkSpeed * 2;
          break;
        case 'mud':
          this.currentSpeed = this.walkSpeed / 2;
          break;
        default:
          break;
      }
    },
    
    dontMove: function () {
      this.moved = false;
    },
    
    didMove: function () {
      return this.moved;
    },
    
    setMoved: function (newMoved) {
      this.moved = newMoved;
    },
    
    die: function() {
      this.dontMove();
      
      // Death animation
      this.isAlive = false;
      this.sceneNode.Rot.X = -80;
    },
    
    versionNumber: function() {
    	console.log("Running version 06");
    }
    
  });
});
