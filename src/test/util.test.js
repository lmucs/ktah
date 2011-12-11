/*
 * Tests for various K'tah utilities.
 */

exports.testLength = function (beforeExit, assert) {
	assert.equal(5, 'Hello'.length);
};

exports.testToUpperCase = function (beforeExit, assert) {
	assert.equal('HELLO', 'Hello'.toUpperCase());
};

