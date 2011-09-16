/**
 * pioneer.js
 *
 * The type of pioneers containing class attributes.
 * 
 * The pioneer acts as a guide and master of exploration.
 * More often away from the group than working closely to it, 
 * he will find resources that fuel class abilities and hideouts 
 * that temporarily obscure the group from detection.
 */

$(function () {
    ktah.types.Pioneer = function () {
        return{
            // Public properties
            learningExp: 0,
            
            // "Constructor"
            create: function (learnedExp) {
                this.learningExp = learnedExp;
            },
        
            // The inspect ability of the Pioneer allows him to mark
            // resources and hideouts, giving him learning XP as well
            inspect: function (resource) {
                this.learningExp += 50;
                // TODO: Mark resource for team mates
            }
            
            // Old code commented out for fear that my way is the wrong way
            // ktah.types.Pioneer = function (name, level, exp) {
            //    this.name = name;
            //    this.level = level;
            //    this.learningExp = exp;
            // }
            // ktah.types.Pioneer.prototype.inspect = function (resource) {
            //     // STUB
            //     alert("Whoa I see " + resource);
            // }
        }
    }
});