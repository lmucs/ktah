/**
 * resource.js
 *
 * Contains general resource attributes.
 * 
 */

$(function () {
  ktah.types.Resource = Backbone.Model.extend({
    defaults: {
      // Public properties
      xPos: 0,
      yPos: 0,
      amount: 0
    }
  });
});