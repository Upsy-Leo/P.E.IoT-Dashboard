const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  location: String,
  personsInHouse: Number,
  houseSize: String,
});

module.exports = mongoose.model("User", UserSchema, 'Users');