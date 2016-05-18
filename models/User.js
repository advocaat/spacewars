var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ShipSchema = new Schema({
    shipName: String,
    shipPrice: Number,
    shipImage: String});

var UserSchema = new Schema({
    id: String,
    email: String,
    firstName: String,
    lastName: String,
    username: String,
    currency: Number,
    password: String,
    ships: [ShipSchema]
});

var User = mongoose.model('User', UserSchema, "Users");

module.exports = User;