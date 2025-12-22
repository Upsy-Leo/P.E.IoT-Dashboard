const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema({
    location: String,
    creationDate: String,
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"}    
});

module.exports = mongoose.model("Sensor", SensorSchema, 'Sensors');
