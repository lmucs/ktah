/**
 * account-display.js
 * 
 * Script for dealing with display elements on the
 * account menu.
 */

$(function () {
  // Set up jquery-ui logout plus its click event
  $("#logout-button")
    .button()
    .click(function () {
      $.ajax({
        type: 'POST',
        url: '/main',
        success: function () {
          window.location = "../";
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        }
      });
  });
  
  // Set up the lobby, account, and about buttons using jquery-ui
  $("#main-menu-button")
    .button()
    .click(function () {
      window.location = "../main";
    });
    
  // Set up the account tabs
  $("#tabs")
    .tabs({ 
      fx: { opacity: 'toggle' } 
    });
    
});
