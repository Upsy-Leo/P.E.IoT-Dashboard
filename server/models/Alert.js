const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
    measureID: { type: mongoose.Schema.Types.ObjectId, ref: "Measures" },
    type: String,
    value: Number,
    status: { type: String, default: "unresolved" },
    createdAt: { type: Date, default: Date.now },
    location: String
});

module.exports = mongoose.model("Alert", AlertSchema, 'Alerts');