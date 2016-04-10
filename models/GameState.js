var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PositionSchema= new Schema({
    x : Number,
    y: Number
})

var GameStateSchema = new Schema({
    playerPosition: PositionSchema,
    enemyPosition: [PositionSchema],
    playerCurrency: Number,
    playerMoves: Number,
    playerTime: Number
});

var GameState = mongoose.model('GameState', GameStateSchema, "GameStates");

module.exports = GameState;