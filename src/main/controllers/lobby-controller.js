/**
 * lobby-controller.js
 *
 * Controller for lobby routes.
 */

module.exports = function (app) {

  /*
   * GET /lobby
   *   Renders the lobby view if logged in, else redirects to login page.
   */
  app.get('/lobby', function (req, res) {
    if (req.session.is_logged_in) {
      res.render('lobby', {
        layout : true,
        userName : req.session.userInfo.accountName
      });
    } else {
      res.redirect('/');
    }
  });
}
