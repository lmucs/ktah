/**
 * ktah.js
 *
 * ALL GLORY TO KTAH!
 */

var ktah = {

  types: {},
  gamestate: {},
  characterArray: [],
  monsterArray: [],
  abilities: {},
  util: {},
  effects: []

};

include.includeInit([
  
  /***** LIBRARIES *****/
  '/js/lib/copperlicht.js',
  '/js/lib/jquery.mousewheel.min.js',
  '/js/lib/underscore.min.js', // backbone dependency
  '/js/lib/backbone.min.js',
  '/js/lib/jquery-ui-1.8.16.custom.min.js',
  
  /***** TYPES *****/
  // Character classes
  '/js/types/bipedal.js',
  
  // Character classes
  '/js/types/characters/character.js',
  '/js/types/characters/pioneer.js',
  '/js/types/characters/architect.js',
  '/js/types/characters/chemist.js',
  '/js/types/characters/herder.js',
  '/js/types/characters/tinkerer.js',
  
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
  
  // Effects
  '/js/types/effects/effect.js',
  '/js/types/effects/start.js',
  '/js/types/effects/pow.js',
  '/js/types/effects/path.js',
  
  
  /***** MODULES *****/
  '/js/modules/round-mechanics.js',
  '/js/modules/copperlicht-ui.js',
  '/js/modules/abilities.js'
]);