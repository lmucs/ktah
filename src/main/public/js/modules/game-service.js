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
    playerNumber = 0,
    playerCount = 0,

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
  
    getGamestate = function (ktahStorage) {
      $.ajax({
        type: 'GET',
        url: '/gamestate/' + gameId,
        data: {
          player : userName
        },
        success: function (data) {
          processGamestate(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    },
    
    // Helper function for maintaining the value of the gamestate
    processGamestate = function (data) {
      ktah.gamestate = data;
      
      for (var i = 0; i < ktah.gamestate.players.length; i++) {
        if (ktah.gamestate.players[i].name === userName) {
          playerNumber = i;
          playerCount++;
        }
      }
    };

$(function () {
  
  // Call the update once to get the ball rolling
  getGamestate();
  
  
  // Then, have the function keep updating frequently
  window.setInterval(getGamestate, 1000);
 
});