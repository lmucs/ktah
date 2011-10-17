/**
 * lobby.js
 *
 * Handles game creation and joining
 */

$(function () {
    
    var userName = $('#userName').attr('data'),
    
        // Helper function to determine if player is present in lobby
        checkForPlayer = function (player, gamestate) {
            for (var i = 0; i < gamestate.players.length; i++) {
                if (player.name === gamestate.players[i].name) {
                    return true;
                }
            }
            return false;
        }
    
    $('#create').click(function () {
      var gameId = prompt("What would you like to call your game?", ""),
          gameExists = false;
      
      // User may have aborted game creation...
      if (gameId === null) {
        alert("You didn't enter a game name!");
        return;
      }
      
      // Check that the game name isn't already taken
      $.ajax({
        type: 'GET',
        url: '/gamestate/' + gameId,
        success: function (data) {
            // If the game already exists, don't create it
            if (!data) {
                  //TODO: create gamestate here
                  var gamestate = JSON.stringify({
                    environment: {
                      game: gameId
                    },
                    players: [
                      {
                        name: userName,
                        character: "Choosing class...",
                        posX: 0,
                        posZ: 0,
                        theta: 0,
                        timeOut: 0,
                        readyState: "notReady"
                      }
                    ]
                  });
                    
                  // post the gamestate to the server
                  $.ajax({
                    type: 'POST',
                    url: '/gamestate/' + gameId,
                    data: gamestate,
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log(jqXHR);
                      console.log(textStatus);
                      console.log(errorThrown);
                    },
                    dataType: 'json',
                    contentType: 'application/json'
                  });
                  // redirect to the correct url
                  window.location = '/room/' + gameId;
                } else {
                  alert("Game name already exists!");
                  return;
                }
            },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    });
    
    $('#join').click(function () {
      var gameId = prompt("What game would you like to join?", "");
      var gamestate = null;
      // TODO: actually need to create the player from session info and such
      var player = {
        name: userName,
        character: "Choosing class...",
        posX: 0,
        posZ: 0,
        theta: 0,
        timeOut: 0,
        readyState: "notReady"
      };      
      $.ajax({
        type: 'GET',
        url: '/gamestate/' + gameId,
        success: function (data) {
          gamestate = data;
          
          // if we got a gamestate
          if (gamestate) {
            // Can't join if there are already 4 players
            if (gamestate.players.length === 4) {
                alert("Cannot join; game is full!");
                return;
            }  
            
            // Check that player is not there presently
            if (!checkForPlayer(player, gamestate)) {
                // add your player to the game.
                gamestate.players.push(player);
            }   
            
            // post the new gamestate to the server
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
            
            // redirect to game url
            window.location = '/room/' + gameId;
          } else {
            alert("Game does not exist!");
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    });
});
