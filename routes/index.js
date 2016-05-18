var express = require('express');
var bodyParser = require('body-parser');
var Dao = require('../DAO/index');
var model = require('../model');

var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("USER ", model.getUser());
    Dao.getUserInfos(model.getUser(), function(data){
        res.render('index', {username: model.getUser(), level: model.getLevel(), userShips: data.ships});
    });
});


router.post('/gameOver', function (req, res, next) {
    var gameTime = JSON.stringify(req.body.time);
    var gameMoves = JSON.stringify(req.body.moves);
    res.render('gameOver', {gameTime: gameTime, gameMoves: gameMoves});

});

router.post('/gameWin', function (req, res, next) {
    var gameTime = JSON.stringify(req.body.time);
    var gameMoves = JSON.stringify(req.body.moves);
    var userName = JSON.stringify(req.body.name);
    var level = model.getLevel();
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

router.get('/register', function (req, res, next) {
    res.render('register');

})
router.post('/register', function (req, res, next) {
    Dao.saveGameState(req.body.username, {}, {}, 0, 0, 0);
    console.log("register " + JSON.stringify(req.body));
    Dao.addUser(req.body.username, 50, req.body.password);
    res.redirect('/');
});

router.post('/login', function (req, res, next) {
    console.log("name " + req.body.username + " password " + req.body.password);
    Dao.retreiveUsernameAndPassword(req.body.username, req.body.password, function (doc) {
        console.log("routes" + doc);
        model.setUser(doc);
        res.redirect('/');
    })

});

router.get('/store',function (req, res) {
    Dao.getAvailableShips(function (ships) {
        res.render('shop', {allShips: ships, username: "'adam'"})
    })

});
router.get('/leaders', function (req, res) {
    Dao.getScores(function (scores) {
        res.render('leaderboard', {scores: JSON.stringify(scores)});
    })
});
router.get("/images/:name", function(req, res){
    res.sendFile(path.resolve('../public/images/' + req.params.name));

});

module.exports = router;
