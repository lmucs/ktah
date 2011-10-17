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
        checkinSecs = new Date().getUTCSeconds(),
        
        // function to grab the game state
        getGamestate = function () {
            $.ajax({
                type: 'GET',
                url: '/gamestate/' + gameId,
                // TODO: Use this to remove people from lobbies
                data: {
                    player : userName,
                    secondStamp : checkinSecs
                },
                success: function (data) {
                    gamestate = data;
                    // Clear players in list
                    playerList.html("");
                    // List a new element for each player in the room
                    for (var i = 0; i < gamestate.players.length; i++) {
                        var currentPlayer = gamestate.players[i],
                            playerAccent = "";
                        
                        // Accent the current player in the lobby
                        if (currentPlayer.name === userName) {
                            playerAccent = 'class="currentPlayer"';
                        }
                        
                        // Add the HTML to the list area
                        playerList.append('<div class="room-player-list"><strong ' + playerAccent + '>'
                        + currentPlayer.name + ':</strong> ' + currentPlayer.character + '</div>');
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
});
