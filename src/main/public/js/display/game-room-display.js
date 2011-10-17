/**
 * login-display.js
 * 
 * Script for dealing with display elements in the
 * login screen.
 */

$(function () {
    var gameId = $("#gameId").attr("data"),
        userName = $("#userName").attr("data"),
        playerList = $("#room-options"),
        readyState = false;
        
        // function to grab the game state
        getGamestate = function () {
            $.ajax({
                type: 'GET',
                url: '/gamestate/' + gameId,
                data: {
                    player : userName,
                    ready : readyState
                },
                success: function (data) {
                    // TODO: Is this the right way to redirect with all ready?
                    console.log(data);
                    if (data === "ready!") {
                        window.location = '/game/' + gameId;
                    } else {
                        gamestate = data;
                        // Clear players in list
                        playerList.html("");
                        // List a new element for each player in the room
                        for (var i = 0; i < gamestate.players.length; i++) {
                            var currentPlayer = gamestate.players[i],
                                playerAccent = "",
                                playerStatus = "room-player-list";
                            
                            if (gamestate.players[i].readyState === "ready") {
                                playerStatus += " room-player-ready";
                            }
                            
                            // Accent the current player in the lobby
                            if (currentPlayer.name === userName) {
                                playerAccent = 'class="currentPlayer"';
                            }
                            
                            // Add the HTML to the list area
                            playerList.append('<div class="' + playerStatus + '"><strong ' + playerAccent + '>'
                            + currentPlayer.name + ':</strong> ' + currentPlayer.character + '</div>');
                        }
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
        };
        
    // Pull the current gamestate on entrance
    getGamestate();
    
    // Update the room every 5 seconds to reflect players leaving / staying
    window.setInterval(getGamestate, 5000);
    
    // Set the ready state button
    $("#readyButton").click(function () {
        if (readyState !== "ready") {
            readyState = "ready";
            $("#readyButton").attr("value", "Not ready!");
        } else {
            readyState = "notReady";
            $("#readyButton").attr("value", "Ready!");
        }
    });
});
