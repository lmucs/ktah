/**
 * herder.js
 *
 * The type of "herder" containing class attributes.
 *
 * Acting in an atypically synergistic fashion with the 
 * horde, the herder serves to mislead and manipulate 
 * zombies so that other team mates have time to gather 
 * resources and perform abilities.
 *
 */

$(function () {
  ktah.types.Herder = ktah.types.Character.extend({
    initialize: function (attributes, options) {
      // do what we need to do whenever we create an Architect
      this.resources = {
        zombieFlesh: 0,
        atomicWaste: 0
      }
    }
  });
});