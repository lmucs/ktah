/**
 * ktah.js
 *
 * ALL GLORY TO KTAH!
 */

var ktah = {

  types: {},

};

include.includeInit([
  
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
]);