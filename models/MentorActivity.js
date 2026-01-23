const mongoose = require("mongoose");

const mentorActivitySchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true
  },

  action: {
    type: String,
    required: true
  },

  meta: {
    type: Object, // extra info if needed
    default: {}
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MentorActivity", mentorActivitySchema);
