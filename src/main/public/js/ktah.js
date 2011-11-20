/**
 * ktah.js
 *
 * ALL GLORY TO KTAH!
 */

var ktah = {

  types: {},
  gamestate: {}

};

include.includeInit([
  
  /***** LIBRARIES *****/
  '/js/lib/copperlicht.js',
  '/js/lib/jquery.mousewheel.min.js',
  '/js/lib/underscore.min.js', // backbone dependency
  '/js/lib/backbone.min.js',
  
  /***** TYPES *****/
  // Character classes
  '/js/types/characters/character.js',
  '/js/types/characters/pioneer.js',
  '/js/types/characters/architect.js',
  '/js/types/characters/chemist.js',
  '/js/types/characters/herder.js',
  '/js/types/characters/tinker.js',
  
  // Monster classes
  '/js/types/monsters/monster.js',
  '/js/types/monsters/basicZombie.js',
  
  // Resources
  '/js/types/resources/resource.js',
  '/js/types/resources/stone.js',
  '/js/types/resources/atomic-waste.js',
  '/js/types/resources/metal.js',
  '/js/types/resources/sand.js',
  '/js/types/resources/water.js',
  '/js/types/resources/wood.js',
  '/js/types/resources/zombie-flesh.js',
  
  /***** MODULES *****/
  '/js/modules/copperlicht-ui.js'
]);