/**
 * game-controller.js
 *
 * Controller responsible for handling the games and gamestates.
 */

module.exports = function(app) {
  // Contains a lobby-ready list of games and # of
  // players within; updated by the trimDisconnects
  var gameList = [],
  
    // Contains functions for gamestate queries
    GameController = {
    games: {},
    get: function (req, res) {
      var gameId = req.params.gameId,
          gamestate = GameController.games[gameId],
          readyCount = 0;
          
      if (gamestate) {
          // With each GET make sure the player has checked in their time
          if (req.query) {
              for (var i = 0; i < gamestate.players.length; i++) {
                  if (gamestate.players[i].name === req.query.player) {
                      gamestate.players[i].timeOut = (new Date).getTime();
                      gamestate.players[i].readyState = req.query.ready;
                  }
                  if (gamestate.players[i].readyState === "ready") {
                      readyCount = readyCount + 1;
                  }
              }
          }
          
          if (readyCount === gamestate.players.length) {
              gamestate.environment.readyState = true;
          }
          
          res.contentType('application/json');
          res.send(JSON.stringify(gamestate));
          
      } else {
          res.send(false);
      }
    },
    post: function (req, res) {
      var gameId = req.params.gameId,
          gamestate = req.body;
      GameController.games[gameId] = gamestate;
      res.send({"success": true});
    }
  },
  
  // Server function that checks the last check-in timestamps on
  // players in games to see if they've disconnected (every 10s)
  trimDisconnects = function () {
    var i = 0;
    gameList = [];
    for (var game in GameController.games) {
      for (var j = 0; j < GameController.games[game].players.length; j++) {
        // If the difference between the server time and the player's last
        // checkin is greater than 10.5 seconds (a little more than 2 ajax calls)
        // then chuck them, as they've left the game
        if ((GameController.games[game].players[j].timeOut) 
         && (Math.abs(GameController.games[game].players[j].timeOut - (new Date).getTime()) > 10500)) {
          GameController.games[game].players.splice(j, 1);
          // If there are no more players left in the game, delete it
          if (GameController.games[game].players.length === 0) {
              delete GameController.games[game];
              console.log("[-] Deleted Game: " + game);
              console.log(GameController.games);
              console.log(); // For visuals...
              break;
          }
        }
      }
      if (typeof(GameController.games[game]) !== "undefined") {
        gameList[i] = {name: game, playerCount : GameController.games[game].players.length};
      }
      
      i++;
    }
  };
  
  app.post('/gamestate/:gameId', GameController.post);
  app.get('/gamestate/:gameId', GameController.get);
  
  // Remove empty games and disconnected players every 3 seconds
  setInterval(trimDisconnects, 3000);
  
  // Handler for returning the list of games to the lobby
  app.get('/gamestate', function(req, res) {
    res.send(gameList);
  });
  
  // Handler for updating a player's position in the gamestate
  app.post('/gamestate/:gameId/:userName', function(req, res) {
    var currentGame = GameController.games[req.params.gameId];
    for (var i = 0; i < currentGame.players.length; i++) {
      if (currentGame.players[i].name === req.params.userName) {
        GameController.games[req.params.gameId].players[i] = req.body;
      }
    }
    res.send({"success": true});
  });
  
}