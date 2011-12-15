/*
 * Unit tests for the K'tah front end.
 */
$(function () {

  test("Stub Tests", function () {
    deepEqual([3, 4, 5], [3, 4, 5], "Array equality WIN!");
    ok(isNaN(NaN), "NaN is NaN");
  });
  
  test("Arithmetic", function () {
    same(2 + 2, 4, "Two plus two equals 4");
  });  
});
