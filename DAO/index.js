var GameState = require('../models/GameState.js');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/SpaceBase");
functions = {};

functions.saveGameState =
    function(playerPosition, enemyPositions, playerCurrency, playerMoves, playerTime){
        var playState = new GameState();
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
//
// playerPosition: PositionSchema,
//     enemyPosition: [PositionSchema],
//     playerCurrency: Number,
//     playerMoves: Number,
//     playerTime: Date

module.exports = functions;