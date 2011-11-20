/**
 * room-controller.js
 *
 * Controller responsible for handling the lobby rooms.
 */

module.exports = function (app) {
  app.get('/room/:gameId', function (req, res) {
    if (req.session.is_logged_in) {
      res.render('room', {
        layout : true,
        gameId : req.params.gameId,
        userName : req.session.userInfo.accountName
      });
    } else {
      res.redirect('/');
    }
  });
}
