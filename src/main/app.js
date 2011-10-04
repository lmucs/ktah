/**
 * app.js
 *
 * Module dependencies.
 */

var express = require('express'), 
    app = module.exports = express.createServer();
    
    /* TESTING
    // Configure database dependencies and constants    
    var mysql = require('mysql'),
    client = mysql.createClient({
        user: 'notTelling',
        password: 'youWishYouKnew',
        host: 'mysql.cs.lmu.edu',
        database: 'aforney2'
    }),
    DATABASE_NAME = 'aforney2',
    ACCOUNTS_TABLE = 'ktah_accounts';
    */


/***** CONFIGURATION *****/

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set("view options", {
    layout : false
  });
  app.register('.html', {
    compile : function(str, options) {
      return function(locals) {
        return str;
      };
    }
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret : 'your secret here'
  }));
  // TODO I don't know much about sessions and what this secret is, but we need to pick a secret!
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});


/***** DATABASE INTEGRATION *****/

/* TESTING
// Set up the accounts table
client.query(
  'CREATE TABLE IF NOT EXISTS ' + ACCOUNTS_TABLE
  + '(accountId INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, '
  + 'accountName VARCHAR(255) NOT NULL, '
  + 'password VARCHAR(255) NOT NULL, '
  + 'PRIMARY KEY (accountId))'
);

// Add some test data
client.query(
  'INSERT INTO '+ ACCOUNTS_TABLE + ' '
  + 'SET accountName = ?, password = ?',
  ['super cool', 'this is a nice text']
);
*/

/***** CONTROLLERS *****/

require('./controllers/game-controller.js')(app);
require('./controllers/chat-controller.js')(app);


/***** ROUTES *****/

app.get('/', function(req, res) {
  res.render('index', {
    layout : true,
  });
});

app.get('/lobby', function(req, res) {
  res.render('lobby', {
    layout : true,
  });
});

app.get('/game/:gameId', function(req, res) {
  res.render('game', {
    gameId : req.params.gameId
  });
});

// Test for ajax posting
app.post('/game/:gameId', function(req, res) {
  var gameId = req.params.gameId;
  console.log(req.body);
  res.contentType('application/json');
  res.send(JSON.stringify({gameId: gameId, test: 1, test2: "two"}));
});


// Current page for testing in game stuff.
app.get('/zombietest', function(req, res) {
  res.render('zombieTest');
});

app.get('/chat', function(req, res) {
  res.render('chat', {
    layout : true,
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
