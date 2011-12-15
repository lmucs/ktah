/**
 * resource.js
 *
 * The abstract type of all resources.
 */

$(function () {
  ktah.types.Resource = Backbone.Model.extend({
    initialize: function(attributes, options) {
      this.type = 'resource';
      this.resourceType = attributes.resourceType;
      this.sceneNode = options.sceneNode.createClone(ktah.scene.getRootSceneNode());
      this.id = attributes.id;

      this.sceneNode.Pos.Y = 4.6;
      this.sceneNode.Pos.X = attributes.posX;
      this.sceneNode.Pos.Z = attributes.posZ;
      this.sceneNode.Scale.Y = this.sceneNode.Scale.X = this.sceneNode.Scale.Z = 4;
    }
  });
});