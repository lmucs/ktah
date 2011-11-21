/**
 * lobby-controller.js
 * 
 * Modularizes lobby-related routing
 */

module.exports = function (app) {
	
	// Simple route for fetching the lobby display
	app.get('/lobby', function (req, res) {
    if (req.session.is_logged_in) {
      res.render('lobby', {
        layout: true,
        userName: req.session.userInfo.accountName
      });
    } else {
      res.redirect('/');
    }
  });

}
