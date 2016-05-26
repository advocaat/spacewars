var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Ship schema
var ShipSchema = new Schema({

    shipName: String,
    shipPrice: Number,
    shipImage: String

});

// Set the ship
var Ship = mongoose.model('Ship', ShipSchema, "Ships");

module.exports = Ship;