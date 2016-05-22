var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShipSchema = new Schema({
    shipName: String,
    shipPrice: Number,
    shipImage: String});


var Ship = mongoose.model('Ship', ShipSchema, "Ships");

module.exports = Ship;
