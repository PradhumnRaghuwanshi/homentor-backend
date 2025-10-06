const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: Number,
  address : {
    type: Object
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
