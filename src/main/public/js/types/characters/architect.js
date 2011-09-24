/**
 * architect.js
 *
 * The type of "architect" containing class attributes.
 *
 * The architect specializes in constructing static defenses
 * against the thundering horde, giving team mates time to 
 * prepare their abilities and recover from rushes.
 *
 */

$(function () {
    ktah.types.Architect = ktah.types.Character.extend({
        
        // Constructor stub
        constructor: function () {
            // TODO
        },
        
        // Public properties
        stone: 0,
        wood: 0,
        scrapMetal: 0,
        sand: 0,
        atomicWaste: 0
        
    });
    
    // Import the script linearly
    ktah.utils.include();
});