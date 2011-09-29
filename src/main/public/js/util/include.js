/**
 * include.js
 *
 * Utility script to include js files within other js files,
 * so you can js file while you js file.
 */

$(function () {

    // Array containing all necessary imports
    var directories = [
    
        /***** LIBRARIES *****/
        '/js/lib/copperlicht.js',
        '/js/lib/base2.min.js',
        
        /***** MODULES *****/
        '/js/modules/copperlicht-ui.js',
        
        /***** TYPES *****/
        // Character classes
        '/js/types/characters/character.js',
        '/js/types/characters/pioneer.js',
        '/js/types/characters/architect.js',
        '/js/types/characters/chemist.js',
        '/js/types/characters/herder.js',
        '/js/types/characters/land-master.js',
        '/js/types/characters/tinker.js',
        
        // Resources
        '/js/types/resources/resource.js',
        '/js/types/resources/stone.js',
        '/js/types/resources/atomic-waste.js',
        '/js/types/resources/metal.js',
        '/js/types/resources/sand.js',
        '/js/types/resources/water.js',
        '/js/types/resources/wood.js',
        '/js/types/resources/zombie-flesh.js'
    
    ],
    
    // Number of imports needed to be handled, plus a counter, n
    numberOfImports = directories.length,
    n = 0;
    
    // Helper function to append the scripts (call once at start)
    ktah.utils.include = function () {
        // Only import when there are more to go
        if (n < numberOfImports) {
            var script = document.createElement("script");
            script.setAttribute("src", directories[n]);
            script.onload = ktah.utils.include;
            document.getElementsByTagName("head")[0].appendChild(script);
            n++;
        }
    };
    
    // Call once to get the ball rolling
    ktah.utils.include();
    
});