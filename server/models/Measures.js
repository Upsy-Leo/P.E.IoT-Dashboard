const mongoose = require("mongoose");

const MeasuresSchema = new mongoose.Schema({
    type: String,
    creationDate: Date,
    sensorID: {type: mongoose.Schema.Types.ObjectId, ref: "Sensor"},
    value: Number 
});

module.exports = mongoose.model("Measures", MeasuresSchema, 'Measures');
