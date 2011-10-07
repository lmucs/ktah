/**
 * account-management.js
 * 
 * Modularizes account-related routing and verification
 */

module.exports = function (app, client) {
    app.get('/', function(req, res) {
        res.render('index', {
            layout : true
        });
    });
      
    app.get('/register', function(req, res) {
        res.render('register', {
            layout : true,
        });
    });
    
    app.post('/register', function(req, res) {
        // Variables to collect database queries
        var inputs = req.body;
            registerFlash = registerUserFlash = registerEmailFlash = registerPassFlash = undefined;
        
        // Perform database checking for duplicates
        client.query(
            'SELECT accountName, email FROM ' + client.ACCOUNTS_TABLE + 
            ' WHERE email="' + inputs.email + '" OR accountName="' + inputs.user + '"',
            function (err, results, fields) {
                // If there are errors for some reason record them
                if (err) {
                    registerFlash = "Hey something went wrong, I'd try again...";
                }
                
                // Only perform checks if results were found from the query
                if (results.length != 0) {
                    if (results[0].accountName === inputs.user) {
                        registerUserFlash = "Looks like the username " + inputs.user + " was taken. Be more creative...";
                    }
                      
                    if (results[0].email === inputs.email) {
                        registerEmailFlash = "You, or an impostor, has already registered " + inputs.email + "...";
                    }
                }
                
                // Always, however, check that the passwords match
                if (inputs.pass1 !== inputs.pass2) {
                    registerPassFlash = "Your passwords don't match... type... very... carefully..."
                }
                      
                // If there are errors, return to the register page with messages
                if (registerFlash || registerUserFlash || registerEmailFlash || registerPassFlash) {
                    res.redirect('back');
                // Otherwise, no errors, return to the login page with a success after adding to DB
                } else {
                    // First, add data to DB  
                    client.query(
                        'insert into ' + client.ACCOUNTS_TABLE + " "
                        + "set accountName = '" + inputs.user + "', "
                        + "password = '" + inputs.pass1 + "', "
                        + "email = '" + inputs.email + "'"
                    );
                
                    // Next, return to the login screen for them to head in to K'tah!
                    res.render('index', {
                        layout : true,
                        loginFlash : 'Account created successfully for ' + req.body.user + '!'
                    });
                }
            }
        );
    });
}
