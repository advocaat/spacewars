var express = require('express');
var bodyParser = require('body-parser');
var Dao = require('../DAO/index');
var model = require('../model');

var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("USER ", model.getUser());
    res.render('index', {username: model.getUser(), level: model.getLevel()});
});



router.post('/gameOver', function (req, res, next) {
    var gameTime = JSON.stringify(req.body.time);
    var gameMoves = JSON.stringify(req.body.moves);
    res.render('gameOver',{gameTime: gameTime, gameMoves: gameMoves});

});

router.post('/gameWin', function (req, res, next) {
    var gameTime = JSON.stringify(req.body.time);
    var gameMoves = JSON.stringify(req.body.moves);
    res.render('gameWin',{gameTime: gameTime, gameMoves: gameMoves});

});

router.get('/register', function(req, res, next){
    res.render('register');

})
router.post('/register', function(req,res, next){
    Dao.saveGameState(req.body.username , {}, {}, 0, 0, 0);
   console.log("register "+ JSON.stringify(req.body)) ;
    Dao.addUser(req.body.username, 50 ,req.body.password);
    res.redirect('/');
});

router.post('/login', function(req, res, next){
    console.log("name "+ req.body.username + " password " + req.body.password);
    Dao.retreiveUsernameAndPassword(req.body.username, req.body.password, function(doc){
        console.log("routes"+ doc);
        model.setUser(doc);
        res.redirect('/');
    })

});

module.exports = router;
