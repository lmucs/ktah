/**
 * Unit tests for the db-config module.
 * 
 * Run from src/test with
 * 
 *   expresso test/db-config.js
 */

var config = require('../../../main/conf/db-config.js');

/*
 * Trivial test with a mock database driver to ensure the query
 * will be executed.
 */
exports.testConfigQuery = function (beforeExit, assert) {
  var mainQuery;
  config({
    query: function (q) {mainQuery = q;},
    ACCOUNTS_TABLE: 'users'
  });
  assert.match(mainQuery, /^create table/i);
  assert.match(mainQuery, /if not exists users\(/i);
};
