/**
 * Unit tests for the db-config module.
 */

var config = require('../main/conf/db-config.js');

// Mock the db client to just return the query.  This code looks awful.
var mainQuery;
config({
  query: function (q) {mainQuery = q;},
  ACCOUNTS_TABLE: 'users'
});

exports.testConfigQuery = function (beforeExit, assert) {
  assert.match(mainQuery, /^create table/i);
  assert.match(mainQuery, /if not exists users\(/i);
};

