var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PositionSchema= new Schema({
    x : Number,
    y: Number,
    z: Number,
    color: String
})

var GameStateSchema = new Schema({
    playerName: String,
    playerPosition: PositionSchema,
    enemyPosition: [PositionSchema],
    playerCurrency: Number,
    playerMoves: Number,
    playerTime: Number
});

var collectionName = "local";
var GameState = mongoose.model('GameState', GameStateSchema, "GameStates");
module.exports = GameState;