/**
 * app.js
 *
 * Configures, initializes, then runs the application.
 */

var express = require('express'),

    app = module.exports = express.createServer(),

    mysql = require('mysql'),

    client = mysql.createClient({
      ACCOUNTS_TABLE : "ktah_accounts",
      host : "mysql.cs.lmu.edu",
      database : "aforney2"
    });

/*
 *
 *  **** APPLICATION CONFIGURATION ****
 *
 */

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set("view options", {
    layout: false
  });
  app.register('.html', {
    compile: function (str, options) {
      return function (locals) {
        return str;
      };
    }
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'your secret here'
  }));
  // TODO I don't know much about sessions and what this secret is, but we need to pick one!
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

/*
 *
 *  **** DATABASE CONFIGURATION ****
 *
 */

// Check that the proper credentials have been set, otherwise, do not mess with database stuff
if (process.env.KTAH_DB_USER && process.env.KTAH_DB_PASS) {
  client.user = process.env.KTAH_DB_USER;
  client.password = process.env.KTAH_DB_PASS;
  require('./public/js/modules/db-config.js')(client);
} else {
  console.error("Database user and/or password not found in environment.");
  console.error("No database will be available to this process.");
}

/*
 *
 *  **** CONTROLLERS ****
 *
 */

require('./controllers/game-controller.js')(app);
require('./controllers/chat-controller.js')(app);
require('./controllers/account-controller.js')(app, client);
require('./controllers/room-controller.js')(app);

/*
 *
 *  **** ROUTE DEFINITIONS ****
 *
 */

// The lobby
app.get('/lobby', function (req, res) {
  if (req.session.is_logged_in) {
    res.render('lobby', {
      layout: true,
      userName: req.session.userInfo.accountName
    });
  } else {
    res.redirect('/');
  }
});

// A chat tester
app.get('/chattest/:room', function (req, res) {
  res.render('chat', {
    layout: true,
    gameId: req.params.room
  });
});

// Play the game with the given id
app.get('/game/:gameId', function (req, res) {
  if (req.session.is_logged_in) {
    res.render('game', {
      gameId: req.params.gameId,
      userName: req.session.userInfo.accountName
    });
  } else {
    res.redirect('/');
  }
});

// Temporary playground for new ideas in zombie play.
app.get('/zombietest', function (req, res) {
    res.render('zombieTest');
});

/*
 *
 *  **** START THE SERVER ****
 *
 */

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
