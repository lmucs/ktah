/**
 * db-config.js
 * 
 * Configures the ktah database on server start
 */

module.exports = function (client) {
    // Set up the accounts table
    client.query(
        'CREATE TABLE IF NOT EXISTS ' + client.ACCOUNTS_TABLE
        + '(accountId INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, '
        + 'accountName VARCHAR(255) NOT NULL, '
        + 'password VARCHAR(255) NOT NULL, '
        + 'PRIMARY KEY (accountId))'
    );
    
    // Add some test data
    client.query(
        'INSERT INTO '+ client.ACCOUNTS_TABLE + ' '
        + 'SET accountName = ?, password = ?',
        ['super cool', 'this is a nice text']
    );
}
