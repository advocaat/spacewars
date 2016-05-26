var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

    // Handle the local signup
    passport.use('signup', new LocalStrategy({

            // Allows us to pass back the entire request to the callback
            passReqToCallback: true

        },
        function (req, username, password, done) {

            findOrCreateUser = function () {

                // Find a user in the database matching the provided username
                User.findOne({'username': username}, function (err, user) {

                    // In case of any error, return using the done method
                    if (err) {

                        console.log('Error in signup: ' + err);
                        return done(err, req.flash('signupMessage', 'Error while signing up.'));

                    }

                    // If the user already exists
                    if (user) {

                        console.log('User already exists with the username: ' + username);
                        return done(null, false, req.flash('signupMessage', 'User already exists.'));

                    } else {

                        // If there is no user with that email address, create the user
                        var newUser = new User();

                        // Set that users credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');
                        newUser.currency = 50;
                        newUser.level = 3;
                        newUser.ships = [{
                            "shipName": "dominator",
                            "shipPrice": 2000000,
                            "shipImage": "/images/dominator.jpg"
                        }];

                        // Save that user account to the database
                        newUser.save(function (err) {

                            if (err) {

                                // An error occurred while processing the user account
                                console.log('Error while saving user: ' + err);
                                throw err;

                            }

                            console.log('User registration successful');
                            return done(null, false, req.flash('successMessage', 'User registration successful!'));

                        });
                    }
                });
            };

            // Delay the execution of findOrCreateUser and execute the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);

        }));

    // Generate an encrypted password using bCrypt
    var createHash = function (password) {

        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
        
    }
}
