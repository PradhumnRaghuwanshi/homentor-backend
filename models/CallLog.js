const mongoose = require("mongoose");

const CallLogSchema = new mongoose.Schema(
  {
    callSid: { type: String, unique: true },
    mentorName: String,
    parentPhone: String,
    mentorPhone: String,
    exophone: String,

    status: String,        // completed, failed, busy
    duration: Number,      // seconds
    price: Number,

    startTime: Date,
    endTime: Date,

    recordingUrl: String,
    direction: String,     // inbound / outbound
    answeredBy: String,    // human / machine

    rawExotelData: Object  // 🔒 full backup (important)
  },
  { timestamps: true }
);

module.exports = mongoose.model("CallLog", CallLogSchema);
