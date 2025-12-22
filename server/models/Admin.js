const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: {type: String, default: "Sylvie"},
    xp:{type: Number, default: 0},
    level:{type: Number, default: 1},
    lastLogin: {type: Date, default: Date.now},   
});

module.exports = mongoose.model("Admin", AdminSchema, 'Admins');
