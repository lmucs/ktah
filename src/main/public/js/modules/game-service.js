/*
 * game-service.js
 * 
 * contains the ajax get and post calls to send
 * to the back end, as well as builds the gamestate
 * object
 * 
 */

var gameId = $("#gameId").attr("data"),
    userName = $("#userName").attr("data"),

    postGamestate = function (gamestate) {
      $.ajax({
        type: 'POST',
        url: '/gamestate/' + gameId,
        data: JSON.stringify(gamestate),
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    },
  
    getGamestate = function () {
      $.ajax({
        type: 'GET',
        url: '/gamestate/' + gameId,
        data: {
          player : userName
        },
        success: function (data) {
          ktah.gamestate = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    };

$(function () {
  
  /* REMOVED BECAUSE IT BREAKS THINGS
  var playerNumber = 0,
  
      updateGamestate = function () {
        getGamestate();
      };
      
  // Call the update once to get the ball rolling
  updateGamestate();
  
  alert(JSON.stringify(ktah.gamestate));
  
  for (var i = 0; i < ktah.gamestate.players.length; i++) {
    if (ktah.gamestate.players[i].name === userName) {
      playerNumber = i;
    }
  }
  
  // Then, have the function keep updating frequently
  window.setInterval(updateGamestate, 1000);
  */
 
});