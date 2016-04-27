var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShipSchema = new Schema({
    model: String
});

var UserSchema = new Schema({
    name: String,
    currency: Number,
    password: String,
    ships: [ShipSchema]
});

var User = mongoose.model('User', UserSchema, "Users");

module.exports = User;