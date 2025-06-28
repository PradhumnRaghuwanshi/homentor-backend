// models/CallMentor.js
const mongoose = require('mongoose');

const CallMentorSchema = new mongoose.Schema({
  name: String,
  phone : Number,
  requestTime: { type: Date, default: Date.now },
  parentPhone : Number
});

module.exports = mongoose.model('CallMentor', CallMentorSchema);
