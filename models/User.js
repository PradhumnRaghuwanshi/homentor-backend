const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: Number,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
