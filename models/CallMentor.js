// models/CallMentor.js
const mongoose = require('mongoose');

const CallMentorSchema = new mongoose.Schema({
  name: String,
  phone : Number,
  date: { type: Date, required: true } // ✅ Add this
});

module.exports = mongoose.model('CallMentor', CallMentorSchema);
