/**
 * game-room-display.js
 * 
 * Script for dealing with display elements in the
 * game room screen.
 */

$(function () {
    var gameId = $("#gameId").attr("data"),
        userName = $("#userName").attr("data"),
        playerList = $("#room-options"),
        readyState = false,
        classSelected = false,
        oldNumber = 0,
        newNumber = 0,
        characterChoice = "",
        
        // function to grab the game state
        getGamestate = function () {
          $.ajax({
            type: 'GET',
            url: '/gamestate/' + gameId,
            data: {
              player : userName,
              ready : readyState,
              character : characterChoice
            },
            success: function (data) {
              newNumber = data.players.length;
              console.log(data);
              if (!data) {
                alert("Game-room closed. Redirecting to Lobby.");
                window.location = '../../lobby';
              }
              if (data.environment.readyState) {
                window.location = '/game/' + gameId;
              } else {
                gamestate = data;
                // Only wipe the list if we have players leave / join
                if (oldNumber !== newNumber) {
                  // Clear players in list
                  playerList.html("");
                }
                
                // List a new element for each player in the room
                for (var i = 0; i < gamestate.players.length; i++) {
                  var currentPlayer = gamestate.players[i],
                      playerAccent = "",
                      playerStatus = "room-player-list";
                  
                  if (gamestate.players[i].readyState === "ready") {
                    playerStatus += " room-player-ready";
                    if (!readyState) {
                      $("#readyButton").fadeTo(250, 0.25).fadeTo(250, 1);
                    }
                  }
                  
                  // Only add the player items if we have players leave / join
                  if (oldNumber !== newNumber) {
                    // Accent the current player in the lobby
                    if (currentPlayer.name === userName) {
                      playerAccent = 'class="currentPlayer"';
                    }
                  
                    // Add the HTML to the list area
                    playerList.append('<div id="' + currentPlayer.name + '-listing" class="' + playerStatus + '"><strong ' + playerAccent + '>'
                    + currentPlayer.name + '</strong><span class="class-selection">'
                    + '<img id="architect" class="class-icon" src="../assets/icons/ArchitectIcon.png">'
                    + '<img id="herder" class="class-icon" src="../assets/icons/HerderIcon.png">'
                    + '<img id="pioneer" class="class-icon" src="../assets/icons/PioneerIcon.png">'
                    + '<img id="scientist" class="class-icon" src="../assets/icons/ScientistIcon.png">'
                    + '<img id="tinkerer" class="class-icon" src="../assets/icons/TinkererIcon.png">'
                    + '</span></div>');
                    
                    // Set the handlers for the class selection
                    $("#" + userName + "-listing > .class-selection").children().each(function () {
                      $(this).unbind("click").click(function () {
                        currentPlayer.character = characterChoice = $(this).attr("id");
                        classSelected = true;
                      });
                    });
                  }
                  
                  // Then, update the necessary list components
                  $("#" + currentPlayer.name + "-listing").toggleClass("room-player-ready", currentPlayer.readyState === "ready");
                  
                  if (currentPlayer.character !== null) {
                    $(".class-icon").each(function () {$(this).removeClass("class-selected")})
                    $("#" + userName + "-listing > .class-selection > " + currentPlayer.character).addClass("class-selected");
                  }
                }
                oldNumber = newNumber;
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
    
    // Update the room every 2 seconds to reflect players leaving / staying
    window.setInterval(getGamestate, 2000);
    
    // Set the ready state button
    $("#readyButton").click(function () {
      if (readyState !== "ready") {
        if (!classSelected) {
          alert("You must choose a class before readying up!");
          return;
        }
        readyState = "ready";
        $("#readyButton").attr("value", "I'm Not Ready!");
      } else {
        readyState = "notReady";
        $("#readyButton").attr("value", "I'm Ready!");
      }
    });
    
});
