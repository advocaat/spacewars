var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/gameOver', function (req, res, next) {
    var cuntsnatcher = JSON.stringify(req.body.time);
    console.log("poop" + cuntsnatcher);
    res.render('gameOver',{poof: cuntsnatcher});

});
module.exports = router;
