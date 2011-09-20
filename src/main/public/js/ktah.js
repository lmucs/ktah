/**
 * ktah.js
 *
 * ALL GLORY TO KTAH!
 */

var ktah = {

  types: {}

};

// TODO: Should all of these includess be in their own script (init.js), and then just that is included here?

/***** LIBRARIES *****/
$.getScript('../js/lib/copperlicht.js');
$.getScript('../js/lib/base2.min.js');

/***** TYPES *****/
    
    // Character classes
    $.getScript('../js/types/characters/character.js');
    $.getScript('../js/types/characters/pioneer.js');
    $.getScript('../js/types/characters/architect.js');
    $.getScript('../js/types/characters/chemist.js');
    $.getScript('../js/types/characters/herder.js');
    $.getScript('../js/types/characters/land-master.js');
    $.getScript('../js/types/characters/tinker.js');
    
    // Resources
    $.getScript('../js/types/resources/resource.js');
    $.getScript('../js/types/resources/stone.js');
    $.getScript('../js/types/resources/atomic-waste.js');
    $.getScript('../js/types/resources/metal.js');
    $.getScript('../js/types/resources/sand.js');
    $.getScript('../js/types/resources/water.js');
    $.getScript('../js/types/resources/wood.js');
    $.getScript('../js/types/resources/zombie-flesh.js');