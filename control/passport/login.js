var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/User');
var bCrypt = require('bcrypt-nodejs');
var DAO = require('../../DAO');

module.exports = function (passport) {

    // Handle the local login
    passport.use('login', new LocalStrategy({

            passReqToCallback: true

        },
        function (req, username, password, done) {

            // Check in the database if a user with that username already exists or not
            User.findOne({'username': username},
                function (err, user) {

                    // In case of any error, return using the done method
                    if (err) {

                        return done(err);

                    }

                    // Username does not exist, log error and redirect back
                    if (!user) {

                        console.log('User not found with username ' + username);
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    }

                    // User exists, but wrong password
                    if (!isValidPassword(user, password)) {

                        console.log('Invalid password');
                        return done(null, false, req.flash('loginMessage', 'Sorry, wrong password.'));

                    }

                    // User and password both match, return user from done method which will be treated like success
                    DAO.resetLevels(user.username);
                    return done(null, user);

                });
        }));

    // Compare the users password with what is in the database
    var isValidPassword = function (user, password) {

        return bCrypt.compareSync(password, user.password);

    }

};