/**
 * include.js
 *
 * Utility script to include js files within other js files.
 */

include = function(src) {
    var script = document.createElement("script");
    script.setAttribute("src", src)
    document.getElementsByTagName("head")[0].appendChild(script);
}