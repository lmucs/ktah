/**
 * account-management.js
 * 
 * Modularizes account-related routing and verification
 */

module.exports = function (app, client) {
    // Helper method to reset warning messages after they've been triggered
    var resetWarnings = function () {
         registerFlash = registerUserFlash = registerEmailFlash = registerPassFlash = undefined; 
    },
    
    // Imports for the validation
    check = require('validator').check,
    sanitize = require('validator').sanitize;
    
    
    /***** LOGIN ROUTERS *****/
    
    // Simple get router for the login page
    app.get('/', function(req, res) {
        resetWarnings();
        // If the user has an active session, send them to the main page
        if (req.session.is_logged_in) {
            res.render('main', {
                layout : true
            });
        } else {
            res.render('index', {
                layout : true 
            });
        }
    });
    
    // Initiates the login process from the index
    app.post('/', function(req, res) {
        var inputs = req.body,
            user = inputs.user,
            pass = inputs.pass,
            session = req.session;
            
        // Perform database check for authentication
        // TODO: TOTALLY SECURE. NO ONE COULD POSSIBLY ATTACK THIS WHATSOEVER. LIKE FORT KNOX UP IN THIS...
        client.query(
            'select accountId, accountName from ' + client.ACCOUNTS_TABLE
            + ' where accountName="' + user + '" and password="'
            + pass + '"',
            function (err, results, fields) {
                // If there's an error, report it then reload the page
                if (err) {
                    console.log(err);
                    loginFlash = "An error has occurred; try again shortly...";
                    res.redirect('back');
                } else if (results[0]) { // Otherwise, see if there was a match
                    session.userInfo = results[0];
                    session.is_logged_in = true;
                    loginFlash = undefined;
                    res.render('main', {
                        layout: true
                    });
                } else { // Or, no match
                    loginFlash = "Username / Password combination not found...";
                    res.redirect('home');
                }
            }
        );
    });
    
    
    /***** LOGOUT ROUTER *****/
    app.post('/main', function(req, res) {
        req.session.is_logged_in = false;
        res.render('index' , {
            layout: true
        });
    });
        
       
    /***** REGISTRATION ROUTERS *****/
    
    // Simple get router for the register page
    app.get('/register', function(req, res) {
        res.render('register', {
            layout : true
        });
    });
    
    // Occurs on "submit" of registration information
    // Validates a registration, then enters to DB if acceptable
    app.post('/register', function(req, res) {
        // Variables to collect database queries
        var inputs = req.body,
            email = inputs.email
            user = inputs.user
            pass1 = inputs.pass1
            pass2 = inputs.pass2;

        // Reset the warnings if there were any from previous attempts at registration
        resetWarnings();
        
        // Perform database checking for duplicates
        client.query(
            'SELECT accountName, email FROM ' + client.ACCOUNTS_TABLE + 
            ' WHERE email="' + email + '" OR accountName="' + user + '"',
            function (err, results, fields) {
                // If there are errors for some reason record them
                if (err) {
                    registerFlash = "Hey something went wrong, I'd try again...";
                }
                
                // Check that the passwords match
                if (pass1 !== pass2) {
                    registerPassFlash = "Your passwords don't match... type... very... carefully..."
                }
                
                // Only perform checks if results were found from the query
                if (results.length != 0) {
                    if (results[0].accountName === user) {
                        registerUserFlash = "Looks like the username " + user + " was taken. Be more creative...";
                    }
                      
                    if (results[0].email === email) {
                        registerEmailFlash = "You, or an impostor, have already registered " + email + "...";
                    }
                } else { // If there were not duplicates found in the db, check that the strings are valid
                    // Start with validating and sanitizing the username
                    try {
                        check(user).notNull().is("^[a-zA-Z0-9_]*$");
                    } catch (e) {
                        registerUserFlash = "Your username must contain at least 1 character choosing from numbers and letters alone..."
                    }
                    
                    // Next, the password
                    try {
                        check(pass1).len(7);
                        // Protect against XSS attack
                        if (pass1 !== sanitize(pass1).xss()) {throw new Error}
                    } catch (e) {
                        registerPassFlash = "Your password must be at least 7 characters long...";
                    }
                    
                    // Finally, the email
                    try {
                        check(email).notNull().isEmail();
                    } catch (e) {
                        registerEmailFlash = "Your email must be of the form somebody@something.huh and cannot be blank..."
                    }
                }
                
                // If there are errors, return to the register page with messages
                if (registerFlash || registerUserFlash || registerEmailFlash || registerPassFlash) {
                    res.redirect('back');
                } else { // Otherwise, no errors, return to the login page with a success after adding to DB
                    // First, add data to DB  
                    client.query(
                        'insert into ' + client.ACCOUNTS_TABLE + " "
                        + "set accountName = '" + user + "', "
                        + "password = '" + pass1 + "', "
                        + "email = '" + email + "'"
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
