var login = require('./login');
var signup = require('./signup');
var User = require('../../models/User');

module.exports = function (passport) {
    // Passport needs to be able to serialize and deserialize users to support persistant login sessions
    // Serializing and Deserializing User Instances
    passport.serializeUser(function (user, done) {
        console.log('serializing user: ', user);
        done(null, user._id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            console.log('deserializing user: ', user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login, SignUp/Registration and Facebook
    login(passport);
    signup(passport);

};