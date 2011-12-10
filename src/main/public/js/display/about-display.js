/**
 * about-display.js
 * 
 * Manages display elements on the About view.
 */

$(function () {
  
  // Configure the main menu button
  $("#main-menu-button")
    .button()
    .click(function () {
      window.location = "../main";
    });
    
  // Configure the tabs
  $("#tabs")
    .tabs({ 
      fx: { opacity: 'toggle' } 
    });
    
});
