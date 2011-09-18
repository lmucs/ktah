/**
 * ktah.js
 *
 * ALL GLORY TO KTAH!
 */

// TODO: Do we want to include jQuery here, or keep it in our html file?

var ktah = {

  types: {}

};

// TODO: Should all of these includes be in their own script (init.js), and then just that is included here?

/***** LIBRARIES *****/
include('../js/lib/copperlicht.js');
include('../js/lib/base2.min.js');

/***** TYPES *****/
    
    // Character classes
    include('../js/types/characters/character.js');
    include('../js/types/characters/pioneer.js');
    include('../js/types/characters/architect.js');
    include('../js/types/characters/chemist.js');
    include('../js/types/characters/herder.js');
    include('../js/types/characters/land-master.js');
    include('../js/types/characters/tinker.js');
    
    // Resources
    include('../js/types/resources/resource.js');
    include('../js/types/resources/stone.js');
    include('../js/types/resources/atomic-waste.js');
    include('../js/types/resources/metal.js');
    include('../js/types/resources/sand.js');
    include('../js/types/resources/water.js');
    include('../js/types/resources/wood.js');
    include('../js/types/resources/zombie-flesh.js');