var GameState = require('../models/GameState.js');
var mongoose = require('mongoose');
var User = require('../models/User.js');
mongoose.connect("mongodb://localhost/SpaceBase");
functions = {};

functions.saveGameState =
    function(username, playerPosition, enemyPositions, playerCurrency, playerMoves, playerTime){
        var playState = new GameState();
        playState.playerName = username;
        playState.playerPosition = playerPosition;
        playState.enemyPosition = enemyPositions;
        playState.playerCurrency = playerCurrency;
        playState.playerMoves = playerMoves;
        playState.playerTime = playerTime;
        playState.save(function(err){
            if(err){
                console.log("no save bra " + err);
            }
        })
    
}

functions.updateGameState = function(username, playerPosition, enemyPositions, playerCurrency, playerMoves, playerTime ){
    GameState.update({playerName: username}, {$set:
    {
        playerPosition: playerPosition,
        enemyPosition: enemyPositions,
        playerCurrency: playerCurrency,
        playerMoves: playerMoves,
        playerTime: playerTime}},
        {multi: true}, function(err, items){
        if(err) {
            console.log("error: " + err);
        }
        console.log(items);
    });
}

functions.getGameState = function(playerName, callback){
    var query = GameState.findOne({playerName: playerName});
    query.lean().exec(function(err, doc){
        if(err){
            throw(err);
        }
        console.log(JSON.stringify(doc));
        callback(doc);

    });

}

functions.addUser = function(name, currency, password){
    var user = new User();
    user.name = name;
    user.currency = currency;
    user.password = password;
    user.ships = [];
    user.save(function(err){
        if(err){
            console.log("No save there" + err);
        }
    })
}

functions.retreiveUsernameAndPassword = function(username, password, callback){
    User.findOne({name: username, password: password}, function(err, doc){
        if(err){
            console.log(err);
        }
            console.log("name-o "+doc.name)
            callback(doc.name);


    });
}


//
// playerPosition: PositionSchema,
//     enemyPosition: [PositionSchema],
//     playerCurrency: Number,
//     playerMoves: Number,
//     playerTime: Date

module.exports = functions;