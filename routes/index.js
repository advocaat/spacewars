var express = require('express');
var bodyParser = require('body-parser');
var Dao = require('../DAO/index');
var model = require('../model');

var router = express.Router();

// Check if a user is already authenticated
var isAuthenticated = function (req, res, next) {

    // If user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // Request and response objects
    if (req.isAuthenticated())

        return next();

    // If the user is not authenticated then redirect him to the login page
    res.redirect('/');

};

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {

        // Display the Login page with any flash message, if any
        res.render('index', {message: req.flash('loginMessage')});

    });

    /* GET home page. */
    router.get('/game', isAuthenticated, function (req, res, next) {

        console.log("Logged in user: ", req.user.username);
        Dao.getUserInfos(req.user.username, function (data) {

            console.log("User ships: " + JSON.stringify(data.ships));
            console.log("User level: " + data.level);
            res.render('game', {

                username: req.user.username.toString(), level: data.level, userShips: data.ships,
                Coincurrency: data.currency

            });
        });
    });

    /* POST game over. */
    router.post('/gameOver', isAuthenticated, function (req, res, next) {

        var gameTime = JSON.stringify(req.body.time);
        var gameMoves = JSON.stringify(req.body.moves);
        res.render('gameOver', {gameTime: gameTime, gameMoves: gameMoves});

    });

    /* POST game win. */
    router.post('/gameWin', isAuthenticated, function (req, res, next) {

        var gameTime = JSON.stringify(req.body.time);
        var gameMoves = JSON.stringify(req.body.moves);
        var userName = JSON.stringify(req.body.name);
        var level = req.body.level;
        console.log("Level: " + level);
        Dao.getLevelScores(level, function (scores) {

            res.render('gameWin', {

                gameTime: gameTime,
                gameMoves: gameMoves,
                userName: userName,
                level: level,
                scores: JSON.stringify(scores)

            });
        })
    });

    /* GET Signup page. */
    router.get('/signup', function (req, res) {

        res.render('signup', {message: req.flash('signupMessage'), okMessage: req.flash('successMessage')});

    });

    /* Handle signup POST. */
    router.post('/signup', passport.authenticate('signup', {

        successRedirect: '/signout',
        failureRedirect: '/signup',
        failureFlash: true

    }));

    /* Handle logout. */
    router.get('/signout', function (req, res) {

        req.logout();
        res.redirect('/');

    });

    /* Handle login POST */
    router.post('/login', passport.authenticate('login', {

        successRedirect: '/game',
        failureRedirect: '/',
        failureFlash: true

    }, function (req, res) {
        Dao.saveGameState(req.user.username,{} ,[], 0,0,0);
    }));

    /* GET store. */
    router.get('/store', isAuthenticated, function (req, res) {

        Dao.getShipsAndUserDeets(req.user.username, function (deets) {

            console.log(JSON.stringify(deets.ships));
            res.render('shop', {allShips: deets.ships, user: deets.user});

        });

    });

    /* GET leaderboard. */
    router.get('/leaders', isAuthenticated, function (req, res) {

        Dao.getScores(function (scores) {

            res.render('leaderboard', {scores: JSON.stringify(scores)});

        });

    });

    /* GET images. */
    router.get("/images/:name", function (req, res) {

        res.sendFile(path.resolve('../public/images/' + req.params.name));

    });

    return router;
    
};
