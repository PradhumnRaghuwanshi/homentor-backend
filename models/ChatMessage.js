const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: { type: String},      // Phone number
  receiver: { type: String },    // Phone number
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
  room: String
});

module.exports = mongoose.model("ChatMessage", chatSchema);
