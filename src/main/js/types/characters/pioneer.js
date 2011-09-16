/**
 * pioneer.js
 *
 * The type of pioneers.  Pioneers in ktah (TODO - describe these things)
 */
$(function () {
    ktah.types.Pioneer = function (name, level, exp) {
        this.name = name;
        this.level = level;
        this.learningExp = exp;
    }

    ktah.types.Pioneer.prototype.inspect = function (resource) {
            // STUB
            console.log("Whoa I see " + resource);
    }
});