/**
 * db-config.js
 * 
 * Configures the ktah database on server start
 */

module.exports = function (client) {
  client.ACCOUNTS_TABLE = 'ktah_accounts';
  query = 'CREATE TABLE IF NOT EXISTS ' + client.ACCOUNTS_TABLE
    + '(accountId INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, '
    + 'accountName VARCHAR(255) NOT NULL, '
    + 'password VARCHAR(255) NOT NULL, '
    + 'email VARCHAR(255) NOT NULL, '
    + 'PRIMARY KEY (accountId))';
  client.query(query, function (err) {
    if (err) console.log('Cannot create table: ' + err)
  });
}
