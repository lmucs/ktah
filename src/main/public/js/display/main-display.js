/**
 * main-display.js
 * 
 * Script for dealing with display elements on the
 * main menu.
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
  $("#lobby-button")
    .button()
    .click(function () {
      window.location = "../lobby";
    });
    
  $("#account-button")
    .button()
    .click(function () {
      alert("Don't you wish you this was implemented?");
    });
    
  $("#about-button")
    .button()
    .click(function () {
      alert("Ktah? What's Ktah?");
    });
  
});
