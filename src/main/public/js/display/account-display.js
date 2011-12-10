/**
 * account-display.js
 * 
 * Manages display elements on the Account view.
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
  
  // Configure the main menu button
  $("#main-menu-button")
    .button()
    .click(function () {
      window.location = '../main';
    });
    
  // Configure the tabs
  $("#tabs")
    .tabs({ 
      fx: { opacity: 'toggle' } 
    });
});
