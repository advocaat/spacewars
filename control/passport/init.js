var login = require('./login');
var signup = require('./signup');
var User = require('../../models/User');

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions

    // Serialize the user
    passport.serializeUser(function (user, done) {

        console.log('Serializing user: ', user);
        done(null, user._id);

    });

    // Deserialize the user
    passport.deserializeUser(function (id, done) {

        User.findById(id, function (err, user) {
            console.log('Deserializing user: ', user);
            done(err, user);
        });

    });

    // Setup the passport strategies for login and signup
    login(passport);
    signup(passport);

};