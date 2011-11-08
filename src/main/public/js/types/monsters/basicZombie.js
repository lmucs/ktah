/**
 * basicZombie.js
 *
 * A Basic Zombie is a type of monster.  It has the simplest of minds.
 */

$(function () {
  ktah.types.BasicZombie = ktah.types.Monster.extend({
    initialize: function(attributes, options) {
      var basicZombie = options.sceneNode.createClone(options.scene.getRootSceneNode());

      this.type = 'basicZombie';
      this.health = 100;

      basicZombie.Pos.Y = 1.3;
      basicZombie.Pos.X = this.posX = attributes.posX;
      basicZombie.Pos.Z = this.posZ = attributes.posZ;

      // TODO: Will eventually be refactored to allow different monster types to share code.

      $.ajax({
        type: 'POST',
        url: '/monsters/' + options.gameId,
        data: JSON.stringify({
          type: this.type,
          id: null,
          health: this.health,
          posX: this.posX,
          posZ: this.posZ
        }),
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    }
  });
});
