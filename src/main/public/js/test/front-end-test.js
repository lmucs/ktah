/*
 * Unit tests for the K'tah front end.
 * 
 * 
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
   * TODO: How to test uris that require that we are logged in?  We can't pass in 
   * credentials in the test because it is open source.  We don't want interactive
   * login.  Env variables?  Or perhaps we can mock the controller......
   */



  module("Posts");
  
  module("Monster Behavior");
  
  module("Player Behavior");
    
  module("For reference only");
  
  test("Stub Tests", function () {
    deepEqual([3, 4, 5], [3, 4, 5], "Array equality WIN!");
    ok(isNaN(NaN), "NaN is NaN");
  });
  
  test("Arithmetic", function () {
    same(2 + 2, 4, "Two plus two equals 4");
  });
  
});
