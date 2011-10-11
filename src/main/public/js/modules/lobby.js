$(function () {

    // ktah.Lobby = function () {
// 
    // }
    
    $('#create').click(function () {
      var gameId = prompt("What would you like to call your game?", Math.random()*1000);
      //TODO: create gamestate here
      var gamestate = JSON.stringify({
        environment: {
          game: gameId
        },
        players: [
          {
            name: "player1",
            character: "chemist",
            posX: 135,
            posZ: -43,
            theta: 90
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
      window.location = '/game/' + gameId;
    });
    
    $('#join').click(function () {
      var gameId = prompt("What game would you like to join?", "");
      var gamestate = null;
      // TODO: actually need to create the player from session info and such
      var player = {
        name: "player2",
        character: "architect",
        posX: 0,
        posZ: 0,
        theta: 0
      };      
      $.ajax({
        type: 'GET',
        url: '/gamestate/' + gameId,
        success: function (data) {
          gamestate = data;
          
          // if we got a gamestate
          if(gamestate !== null) {
            // add your player to the game.
            gamestate.players.push(player);            
            
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
            window.location = '/game/' + gameId;
          } else {
            alert("game does not exist!");
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
