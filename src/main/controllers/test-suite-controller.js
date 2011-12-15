/**
 * test-suite-controller.js
 *
 * Controller for launching unit tests.
 */

module.exports = function (app) {
	
  /*
   * GET /test
   *   Run unit tests
   * 
   * TODO: Move into proper directory.
   */
  app.get('/test', function (req, res) {
    res.render('test-suite', {layout: false});
  });
}  
