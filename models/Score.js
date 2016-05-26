var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Score schema
var ScoreSchema = new Schema({

    userName: String,
    userMoves: Number,
    userTime: Number,
    level: Number

});

// Set the score
var Score = mongoose.model('Score', ScoreSchema, "Scores");

module.exports = Score;