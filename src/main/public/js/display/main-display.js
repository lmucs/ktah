/**
 * main-display.js
 * 
 * Manages display elements on the main view.
 */

$(function () {

  // Configure the logout button
  $("#logout-button")
    .button()
    .click(function () {
      $.ajax({
        type: 'POST',
        url: '/main',
        success: function () {
          window.location = '../';
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        }
      });
  });
  
  // Configure the lobby, account, and about buttons
  $("#lobby-button")
    .button()
    .click(function () {
      window.location = '../lobby';
    });
    
  $("#account-button")
    .button()
    .click(function () {
      window.location = '../account';
    });
    
  $("#about-button")
    .button()
    .click(function () {
      window.location = '../about';
    });
});
