// models/CallMentor.js
const mongoose = require('mongoose');

const CallMentorSchema = new mongoose.Schema({
  name: String,
  phone : Number,
  requestTime: { type: Date, default: Date.now } // ✅ Add this
});

module.exports = mongoose.model('CallMentor', CallMentorSchema);
