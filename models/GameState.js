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
    playerTime: Date
});