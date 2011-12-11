/*
 * app.js
 *
 * It all starts here. This is the script to run under node.  It configures 
 * and initializes the application, and starts the server.
 * 
 * To run the application, set the environment variables:
 * 
 *   KTAH_DB_HOST
 *   KTAH_DB_DATABASE
 *   KTAH_DB_USER
 *   KTAH_DB_PASS
 * 
 * then invoke as usual:
 * 
 *   node app.js
 */

['HOST', 'DATABASE', 'USER', 'PASS'].forEach(function (suffix) {
	var variable = 'KTAH_DB_' + suffix;
	if (! process.env[variable]) {
		console.error('Missing environment variable: ' + variable);
		process.exit(1);
	}
});

/*
 * EXPRESS SERVER CONFIGURATION
 */

var express = require('express');

var app = module.exports = express.createServer();

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
  host : process.env.KTAH_DB_HOST,
  database : process.env.KTAH_DB_DATABASE,
  user : process.env.KTAH_DB_USER,
  password : process.env.KTAH_DB_PASS
});

require('./public/js/modules/db-config.js')(client);

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
