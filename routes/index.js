var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
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

module.exports = router;
