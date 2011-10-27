/**
 * monster.js
 *
 * Contains general basicZombie attributes and functions.
 */

$(function () {
    ktah.types.BasicZombie = ktah.types.Monster.extend({
      initialize: function() {
        var basicZombie = this.sceneNode.createClone(this.scene.getRootSceneNode());
        
        this.type = 'basicZombie';
        
        //TODO: Randomize these but with some limitations?
        basicZombie.Pos.Y = 1.4;
        basicZombie.Pos.X = this.posX = 0;
        basicZombie.Pos.Z = this.posZ = 0;
        
        // $.ajax({
          // type: 'POST',
          // url: '/gamestate/' + gameId + '/monsters',
          // data: {
            // type : this.type,
            // id: null,
            // health: this.health,
            // posX: this.posX,
            // posZ: this.posZ
          // },
          // error: function (jqXHR, textStatus, errorThrown) {
            // console.log(jqXHR);
            // console.log(textStatus);
            // console.log(errorThrown);
          // },
          // dataType: 'json',
          // contentType: 'application/json'
        // });
      }
    });
});