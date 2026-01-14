const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: Number,
  address: {
    type: Object
  },
  parentName: String,
  children: Array,
  disclaimerAccepted: {
    type: Boolean,
    default: false,
  },
  disclaimers: {
    type : Array
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
