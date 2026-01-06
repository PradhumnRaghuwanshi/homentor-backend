const mongoose = require("mongoose");

const CallLogSchema = new mongoose.Schema(
  {
    callSid: {
      type: String,
      index: true,
    },

    parentPhone: {
      type: String,
      index: true,
    },

    mentorPhone: {
      type: String,
      index: true,
    },

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },

    status: {
      type: String,
      enum: ["initiated", "answered", "completed", "failed", "busy", "no-answer"],
    },

    duration: Number, // seconds

    recordingUrl: String,

    disconnectReason: String,

    rawExotelData: Object, // full payload for safety/debug

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CallLog", CallLogSchema);
