var mongoose = require('mongoose');

// Set the schema
var Schema = mongoose.Schema;

// Set the ship schema
var ShipSchema = new Schema({

    shipName: String,
    shipPrice: Number,
    shipImage: String

});

// Set the user schema
var UserSchema = new Schema({

    id: String,
    email: String,
    firstName: String,
    lastName: String,
    username: String,
    currency: Number,
    password: String,
    ships: [ShipSchema],
    level: Number

});

// Set the user
var User = mongoose.model('User', UserSchema, "Users");

module.exports = User;