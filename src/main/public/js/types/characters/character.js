/**
 * charClass.js
 *
 * Contains general character attributes between classes.
 * 
 */

$(function () {
    ktah.types.Character = base2.Base.extend({
            // Public properties
            name: "",
            level: 1,
            health: 100, // TODO: Arbitrary placeholder
            roundExp: 0
    });
    
    // Import the script linearly
    ktah.utils.include();
});