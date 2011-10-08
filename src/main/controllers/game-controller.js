/**
 * game-controller.js
 *
 * Controller responsible for handling the games and gamestates.
 */

module.exports = function(app) {
  var GameController = {
    games: {},
    get: function (req, res) {
      var gameId = req.params.gameId;
      res.send(JSON.stringify(GameController.games[gameId]));
    },
    post: function (req, res) {
      var gameId = req.params.gameId,
          gamestate = req.body;
      GameController.games[gameId] = gamestate;
      console.log(GameController.games);
      res.send({"success": true});
    }
  };
  
  app.post('/gameinfo/:gameId', GameController.post);
  app.get('/gameinfo/:gameId', GameController.get);
}