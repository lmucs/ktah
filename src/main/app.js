/**
 * app.js
 *
 * Module dependencies.
 */

var express = require('express'), 
    app = module.exports = express.createServer(),
    
    // Configure database dependencies and constants    
    mysql = require('mysql'),
    client = mysql.createClient({
      ACCOUNTS_TABLE: "ktah_accounts",
      host: "mysql.cs.lmu.edu",
      database: "aforney2"
    });


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

// Check that the proper credentials have been set,
// otherwise, do not mess with database stuff
if (process.env.KTAH_DB_USER && process.env.KTAH_DB_PASS) {
  client.user = process.env.KTAH_DB_USER;
  client.password = process.env.KTAH_DB_PASS;
  require('./public/js/modules/db-config.js')(client);
} else {
  console.log("DB-ERROR: User and / or Password were not set as environment variables. Aborting database config.");
}


/***** CONTROLLERS *****/

require('./controllers/game-controller.js')(app);
require('./controllers/chat-controller.js')(app);


/***** ROUTES *****/

// Routes for account management
require('./controllers/account-controller.js')(app, client);


// Routes for game initation
app.get('/lobby', function(req, res) {
  res.render('lobby', {
    layout : true,
    userName: req.session.userInfo.accountName
  });
});

//this is for testing chat:
app.get('/chat/:room', function(req, res) {
  res.render('chat', {
    layout : true, 
    gameId : req.params.room
  });
});


// Routes for gameplay
app.get('/game/:gameId', function(req, res) {
  res.render('game', {
    gameId : req.params.gameId
  });
});

app.get('/room/:gameId', function(req, res) {
  res.render('room', {
    layout : true,
    gameId : req.params.gameId,
    userName : req.session.userInfo.accountName
  });
});

app.post('/room/:gameId', function(req, res) {
  res.redirect('/game/' + req.params.gameId);
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

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
