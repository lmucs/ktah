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
            if (req.query.character && gamestate.players[i].name === req.query.player) {
              gamestate.players[i].character = req.query.character;
            }
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
      // Only create a game if the user isn't spamming them
      if (!req.session.lastGameCreated 
          || Math.abs(req.session.lastGameCreated - (new Date).getTime()) > 10000) {
        req.session.lastGameCreated = (new Date).getTime();
        GameController.games[gameId] = gamestate;
        res.send({"success": true});
      } else {
        res.send({"success": false});
      }
    }
  },
  
  // Server function that checks the last check-in timestamps on
  // players in games to see if they've disconnected (every 10s)
  trimDisconnects = function () {
    var i = 0;
    gameList = [];
    for (var game in GameController.games) {
      var gamePlayers = GameController.games[game].players,
          playerClasses = [];
      for (var j = 0; j < gamePlayers.length; j++) {
        // If the difference between the server time and the player's last
        // checkin is greater than 10.5 seconds (a little more than 2 ajax calls)
        // then chuck them, as they've left the game
        if ((gamePlayers[j].timeOut)
         && (Math.abs(gamePlayers[j].timeOut - (new Date).getTime()) > 10500)) {
          gamePlayers.splice(j, 1);
        }
        if (gamePlayers[j]) {
          playerClasses.push(gamePlayers[j].character);
        }
      }
      // If there are no more players left in the game, delete it
      if (gamePlayers.length === 0) {
        delete GameController.games[game];
        console.log("[-] Deleted Game: " + game);
        console.log(GameController.games);
        console.log(); // For visuals...
        break;
      }
      if (typeof(GameController.games[game]) !== "undefined") {
        gameList[i] = {
          name: game,
          playerCount : GameController.games[game].players.length,
          playerClasses : playerClasses,
          begun : GameController.games[game].environment.readyState
        };
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
    // If the game doesn't exist, ABORT!
    if (!currentGame) {
      return;
    }
    for (var i = 0; i < currentGame.players.length; i++) {
      var currentPlayer = currentGame.players[i];
      if (currentPlayer.name === req.params.userName) {
        GameController.games[req.params.gameId].players[i] = req.body;
        if (currentPlayer.attacking !== -1) {
          currentGame.players[i].pointsRemaining += 5;
          currentGame.players[i].pointsEarned += 5;
          currentGame.players[currentPlayer.attacking].beingAttacked = true;
        }
      }
    }
    res.send({"success": true});
  });
  
  // Handler to remove a player from a game or game room
  app.get('/gamestate/:gameId/:userName', function(req, res) {
    var gamePlayers;
    if (typeof(GameController.games[req.params.gameId]) !== "undefined") {
      gamePlayers = GameController.games[req.params.gameId].players;
    }
    if (gamePlayers && req.query) {
      for (var i = 0; i < gamePlayers.length; i++) {
        if (req.query.player === gamePlayers[i].name) {
          gamePlayers.splice(i, 1);
        }
      }
    }
    trimDisconnects();
    res.redirect('/lobby');
  });
  
  // Handler to redirect to the score screen and manage final points
  app.post('/score/:gameId', function(req, res) {
    var currentGame = GameController.games[req.params.gameId];
    if (currentGame) {
      for (var i = 0; i < currentGame.players.length; i++) {
        if (currentGame.players[i].name === req.session.userInfo.accountName) {
          // TODO: Perform account point adding here
        }
      }
      req.session.gameScore = currentGame.players;
      res.send({"success": true});
    }
  });
  
  // Handler to access the score screen
  app.get('/score/:gameId', function(req, res) {
    // Make sure the person has a score to display, otherwise route to lobby
    if (req.session.gameScore) {
      res.render('score', {
        layout: true,
        score: req.session.gameScore,
        userName: req.session.userInfo.accountName,
        gameId: req.params.gameId
      });
      req.session.gameScore = undefined;
    } else {
      res.redirect('/lobby');
    }
  });
  
  // Post handler to add new monsters to the game
  app.post('/monster/:gameId', function(req, res) {
    
    var monster = req.body,
        currentGame = GameController.games[req.params.gameId];
        
      if (!currentGame.monsters || typeof(currentGame.monsters) === "undefined") {
    	  currentGame.monsters = [];
      }
      
      monster.id = currentGame.monsters.length;
      currentGame.monsters.push(monster);
      res.contentType('application/json');
      res.send(JSON.stringify({"monsterId": monster.id}));
  });
  
  // Post handler to update the entire monster array
  app.post('/monsters/:gameId', function(req, res) {
	  
	var currentGame = GameController.games[req.params.gameId];
	
	// If the game doesn't exist, ABORT!
	if (!currentGame) {
	  return;
	}
	
	// Update current monster array
	currentGame.monsters = req.body;
  });
}