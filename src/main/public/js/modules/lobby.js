/**
 * lobby.js
 *
 * Handles game creation and joining
 */

$(function () {
    
    // Name of the user in the current session
    var userName = $('#userName').attr('data'),
        inputGameName = "",
        protoPlayer = 
          {
            name: userName,
            character: null,
            health : 100,
            pointsRemaining: 0,
            pointsEarned: 0,
            attacking: -1,
            beingAttacked: false,
            posX: 0,
            posZ: 0,
            posY: 0,
            theta: 0,
            timeOut: 0,
            status: "alive",
            readyState: "notReady"
          },
    
        // Helper function to determine if player is present in lobby
        checkForPlayer = function (player, gamestate) {
          for (var i = 0; i < gamestate.players.length; i++) {
            if (player.name === gamestate.players[i].name) {
              return true;
            }
          }
          return false;
        },
        
        // Helper method to bind join methods to the lobby list
        buttonizeGameList = function () {
          $(".lobby-game").each(function (index) {
            // Set up hover effect for mouse overs
            $(this).hover(
            function () {
              $(this).addClass('lobby-game-mouseOver');
            },
            function () {
              $(this).removeClass('lobby-game-mouseOver');
            })
            
            // Bind the ajax call to the click
            .click(function () {
              joinGame($(this).children(":nth-child(2)").children(":last-child").html());
            });
          });
        },
        
        // Recurring function to update game list
        updateGames = function () {
          $.ajax({
            type: 'GET',
            url: '/gamestate',
            success: function (data) {
              var allGames = data,
                  gameList = $("#game-list"),
                  listCount = 0;
              
              // Clear the list currently shown
              gameList.html("");
              // List a new element for each player in the room
              for (var i = 0; i < allGames.length; i++) {
                var classIcons = "";
                for (var j = 0; j < allGames[i].playerClasses.length; j++) {
                  if (allGames[i].playerClasses[j] !== null) {
                    classIcons += '<img class="lobby-class-thumbnail" src="../assets/icons/' + allGames[i].playerClasses[j] + 'Icon.png"></img>'
                  }
                }
                // Add the HTML to the list area
                if (allGames[i] !== null && !allGames[i].begun) {
                  gameList.append(
                    '<div class="lobby-game"><div class="lobby-playerCount">'
                    + allGames[i].playerCount + ' / 4</div><div class="lobby-gameName"><strong>Game: </strong>'
                    + '<span class="game">' + allGames[i].name + '</span></div><div class="lobby-classPreview">' + classIcons + '</div>'
                    + '</div>'
                  );
                  listCount++;
                }
              }
              
              if (listCount === 0) {
                gameList.append(
                  '<p class="lobby-noGames">Sad time! No games available...</p>'
                );
              }
              
              // Lastly, buttonize the games that were populated
              buttonizeGameList();
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
        
        // Function to join a game
        joinGame = function (gameName) {
          // If nothing was passed in, user used the join game button, so prompt
          // them for a game name. Otherwise, use the game they chose from the game list.
          if (!gameName) {
            var gameId = prompt("Enter a game name that you would like to join.");
          } else {
            gameId = gameName;
          }
          
          warningDialog("Joining game now, please wait...");
          
          var gamestate = null;
          // create the player to be added to the game state.
          var player = protoPlayer;      
          
          // get the gamestate of the game they are attempting to join
          $.ajax({
            type: 'GET',
            url: '/gamestate/' + gameId,
            success: function (data) {
              gamestate = data;
              
              // if we got a gamestate
              if (gamestate) {
                // Can't join if there are already 4 players
                if (gamestate.players.length >= 4) {
                    warningDialog("The game is already full!");
                    return;
                }
                
                if (gamestate.environment.readyState) {
                  warningDialog("Cannot join game in progress!");
                  return;
                }
                
                // Check that player is not there presently
                if (!checkForPlayer(player, gamestate)) {
                    // add your player to the game.
                    gamestate.players.push(player);
                    gamestate.environment.abilityQueue[player.name] = [];
                }   
                
                // post the updated gamestate to the server
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
                
                // redirect to waiting room url
                window.location = '/room/' + gameId;
              } else {
                warningDialog("Game does not exist!");
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
        },
        
        // Function to create a game
        createGame = function () {
          var gameId = prompt("What would you like to call your game?", ""),
              playerName = protoPlayer.name;
          
          // User may have aborted game creation...
          if (gameId === null) {
            return;
          } else if (gameId.length > 20) {
            warningDialog("Game name too long! Less than 20 characters please.");
            return;
          } else if(gameId.indexOf("/") !== -1) {
            warningDialog("Game name cannot contain a slash ('/')");
            return;
          }
          
          warningDialog("Creating game now, please wait...");
          
          // Check that the game name isn't already taken
          $.ajax({
            type: 'GET',
            url: '/gamestate/' + gameId,
            success: function (data) {
                // If the game already exists, don't create it
                if (!data) {
                    var gamestate = {
                      environment: {
                        game: gameId,
                        readyState : false,
                        abilityQueue: {}
                      },
                      players: [
                        // automatically add in the game creators player object
                        protoPlayer
                      ]
                    };
                    
                    gamestate.environment.abilityQueue[playerName] = [];
                      
                    // post the gamestate to the server
                    $.ajax({
                      type: 'POST',
                      url: '/gamestate/' + gameId,
                      data: JSON.stringify(gamestate),
                      success: function (data) {
                        if (!data.success) {
                          warningDialog("You've created a game too recently; try again in 10 seconds.");
                          return;
                        } else {
                          // redirect to the correct url
                          window.location = '/room/' + gameId;
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
                  } else {
                    warningDialog("A game with that name already exists!");
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
        },
        
        warningDialog = function (message) {
          $("#waiting-dialogue")
            .attr("title", "K'tah! Lobby")
            .text(message)
            .dialog("close")
            .dialog({
              width: 400,
              resizable: false,
              modal: true,
              buttons: { "Ok": function() { $(this).dialog("close"); } }
            });
        };
        
    // BUTTON BINDINGS
    $('#create')
      .button()
      .click(function () {
        createGame();
      });
    
    $('#join')
      .button()
      .click(function () {
        joinGame();
      });
    
    $("#menu-button")
      .button()
      .click(function () {
        window.location = "../main";
      });
    
    // Call the game update once to start
    updateGames();
    
    // Update the games every 3 seconds
    window.setInterval(updateGames, 3000);
    
});
