/**
 * login-display.js
 * 
 * Manages display elements on the Login view.
 */

$(function () {

    // Set the focus on the login input
    $("#user").focus();
    
    // Buttonize the... buttons
    $("#loginButton").button();
    
    $("#registerButton")
      .button()
      .click(function () {
        window.location = "/register";
      });
      
    $("#aboutButton")
      .button()
      .click(function () {
        window.location = "/about";
      });
});
