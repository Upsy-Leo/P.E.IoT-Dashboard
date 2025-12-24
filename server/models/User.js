const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  location: String,
  personsInHouse: Number,
  houseSize: String,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  role: String,
});

module.exports = mongoose.model("User", UserSchema, 'Users');