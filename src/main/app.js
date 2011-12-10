/*
 * app.js
 *
 * It all starts here. This is the script to run under node.  It configures 
 * and initializes the application, and starts the server.
 * 
 * To run the application set the environment variables
 * 
 *   KTAH_DB_USER
 *   KTAH_DB_PASS
 * 
 * and invoke the usual
 * 
 *   node app.js
 */

var express = require('express');

var app = module.exports = express.createServer();

/*
 * EXPRESS SERVER CONFIGURATION
 */

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
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
    secret: 'zombie devops feynman'
  }));
  app.use(app.router);
  app.use(express['static'](__dirname + '/public'));
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
 * DATABASE CONFIGURATION
 */

var mysql = require('mysql');

var client = mysql.createClient({
  ACCOUNTS_TABLE : 'ktah_accounts',
  host : 'mysql.cs.lmu.edu',
  database : 'aforney2'
});

// Configure database only if the environment variables have been set
if (process.env.KTAH_DB_USER && process.env.KTAH_DB_PASS) {
  client.user = process.env.KTAH_DB_USER;
  client.password = process.env.KTAH_DB_PASS;
  require('./public/js/modules/db-config.js')(client);
} else {
  console.error('Database user and/or password not found in environment.');
  console.error('No database will be available to this process.');
}

/*
 * CONTROLLERS
 */

require('./controllers/game-controller.js')(app);
require('./controllers/lobby-controller.js')(app);
require('./controllers/chat-controller.js')(app);
require('./controllers/account-controller.js')(app, client);
require('./controllers/room-controller.js')(app);

/*
 * START THE SERVER
 */

app.listen(3000);
console.log('Express server listening on port %d in %s mode', 
    app.address().port, app.settings.env);
