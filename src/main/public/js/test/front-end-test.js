/*
 * Unit tests for the K'tah front end.
 * 
 * The following tests are run under QUnit. 
 */
$(function () {

  /*
   * Tests for hitting some of the URLs.  The tests are not ideal because they are
   * expecting content in the returned HTML which, as of now, if not localized, and
   * will thus need to be changed when K'tah is properly internationalized.
   */
  module("Simple GETs");

  /*
   * The webapp root should give back either the login page or the main page.
   * As of now we can only test by content. Not very satisfying.
   */
  asyncTest("Webapp root", function () {
  	$.ajax({
      url: "/",
      success: function (data) {
      	ok(data.indexOf("<h2>Login") >= 0 || data.indexOf("<h1>K'tah") >= 0);
      },
      complete: start
  	});
  });

  /*
   * The about page is always accessible.
   */
  asyncTest("About page", function () {
  	$.ajax({
      url: "/about",
      success: function (data) {
      	ok(data.indexOf("<h1>About") >= 0);
      },
      complete: start
  	});
  });

  /*
   * TODO: Test uris that require that we are logged in.
   */

  /*
   * Tests some URIs with the POST method.
   */
  module("Posts");
  
  /*
   * Tests the ktah object.
   */
  module("Basics")
  
  test("Ktah Tests", function () {
  	ok(ktah, "ktah is defined");
    ok(ktah.types && ktah.gamestate && ktah.characterArray && ktah.monsterArray
    	&& ktah.abilities && ktah.util && ktah.effects, "ktah properties defined");
  });
  
  /*
   * Tests the game objects.
   */
  module("Types");
  
  test("Character Tests", function () {
  	// TODO assertions for architect, chemist, etc.
  });
  
  test("Monster Tests", function () {
  	// TODO assertions for monster, basic zombie, etc.
  });
  
  /*
   * Tests the chat subsystem.
   */
  module("Chat");
  
});
