const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: { type: String, required: true },      // Phone number
  receiver: { type: String, required: true },    // Phone number
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatMessage", chatSchema);
