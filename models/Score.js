var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
    userName: String,
    userMoves: Number,
    userTime: Number,
    level: Number
});


var Score = mongoose.model('Score', ScoreSchema, "Scores");

module.exports = Score;
