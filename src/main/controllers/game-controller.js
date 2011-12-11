/*
 * game-controller.js
 *
 * Controller for game and gamestate routes.
 */

module.exports = function (app) {
	
  // Contains a lobby-ready list of games and the number of players within, updated 
  // by the global function trimDisconnects.
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
  
  /*
   * POST /gamestate/:gameId
   *   Greates a game, if possible.
   */
  app.post('/gamestate/:gameId', GameController.post);
  
  /*
   * POST /gamestate/:gameId
   *   Retrieves the current gamestate.
   */
  app.get('/gamestate/:gameId', GameController.get);
  
  // Remove empty games and disconnected players every 3 seconds
  setInterval(trimDisconnects, 3000);
  
  /*
   * GET /gamestate
   *   Retrieves the list of games.
   */
  app.get('/gamestate', function(req, res) {
    res.send(gameList);
  });
  
  /*
   * POST /gamestate/:gameId/:userName
   *   Updates a player's position in the gamestate.
   */
  app.post('/gamestate/:gameId/:userName', function (req, res) {
    var currentGame = GameController.games[req.params.gameId];
    // If the game doesn't exist, ABORT!
    if (!currentGame) {
      return;
    }
    for (var i = 0; i < currentGame.players.length; i++) {
      var currentPlayer = currentGame.players[i];
      if (currentPlayer.name === req.params.userName) {
        GameController.games[req.params.gameId].players[i] = req.body;
      }
    }
    res.send({"success": true});
  });
  
  /*
   * GET /game/:gameId/
   *   Plays the game with the given id. In other words, render the game view if logged in,
   *   otherwise redirect to login page.
   */
  app.get('/game/:gameId', function (req, res) {
    if (req.session.is_logged_in) {
      res.render('game', {
        gameId: req.params.gameId,
        userName: req.session.userInfo.accountName
      });
    } else {
      res.redirect('/');
    }
  });
  
  /*
   * GET /gamestate/:gameId/:userName
   *   Removes a player from a game or game room
   */
  app.get('/gamestate/:gameId/:userName', function (req, res) {
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
  
  /*
   * POST /score/:gameId
   *   Redirect to the score screen and manage final points
   */
  app.post('/score/:gameId', function (req, res) {
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
  
  /*
   * GET /score/:gameId
   *   Access the score screen
   */
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
  
  /*
   * POST /monster/:gameId
   *   Adds a new monster to the game
   */
  app.post('/monster/:gameId', function(req, res) {
    
    var monster = req.body,
        currentGame = GameController.games[req.params.gameId];
        
    if (typeof(currentGame.monsters) === "undefined" || !currentGame.monsters) {
  	  currentGame.monsters = [];
  	}
    monster.id = currentGame.monsters.length;
    currentGame.monsters.push(monster);
    res.contentType('application/json');
    res.send(JSON.stringify({"monsterId": monster.id}));
  });
  
  /*
   * POST /monsters/:gameId
   *   Updates the monster array
   */
  app.post('/monsters/:gameId', function (req, res) {
	  
  	var currentGame = GameController.games[req.params.gameId],
  	    monsterCollector = [];
  	
  	// If the game doesn't exist, ABORT!
  	if (!currentGame) {
  	  return;
  	}
  	
  	// Update current monster array
  	for (var monster in req.body) {
  	  monsterCollector.push(req.body[monster]);
  	}
  	currentGame.monsters = monsterCollector.slice(0);
  	res.send({"success": true});
  });
  
  /*
   * GET /monsters/:gameId
   *   Retrieves the monster array
   */
  app.get('/monsters/:gameId', function (req, res) {
    var currentGame = GameController.games[req.params.gameId];
    res.contentType('application/json');
    console.log();
    console.log(currentGame.monsters);
    console.log(JSON.stringify(currentGame.monsters));
    console.log();
    res.send(currentGame.monsters);
  });
  
  /*
   * POST /abilities/:gameId
   *   Updates abilities used
   */
  app.post('/abilities/:gameId', function (req, res) {
    var abilityUsed = req.body,
        currentGame = GameController.games[req.params.gameId];
    for (var i = 0; i < currentGame.players.length; i++) {
      var currentName = currentGame.players[i].name;
      currentGame.environment.abilityQueue[currentName].push(req.body);
    }
    res.send({"success": true});
  });
  
  /*
   * POST /abilities/:gameId
   *   Updates abilities used
   */
  app.post('/abilityDone/:gameId/:userName', function (req, res) {
    var abilityCount = req.body.count,
        currentGame = GameController.games[req.params.gameId];
    for (var i = 0; i < currentGame.players.length; i++) {
      var currentName = currentGame.players[i].name;
      if (req.params.userName === currentName) {
        currentGame.environment.abilityQueue[currentName].splice(0, abilityCount);
      }
    }
    res.send({"success": true});
  });
}
