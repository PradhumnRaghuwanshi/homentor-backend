const mongoose = require("mongoose");

const classRecordSchema = new mongoose.Schema({
  classBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassBooking",
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: true,
  },
  date: {
    type: Date,
    // required: true,
  },
  timeIn: {
    type: String,
    // required: true,
  },
  timeOut: {
    type: String,
    // required: true,
  },
  duration: {
    type: String, // or Number if you calculate in minutes
    required: true,
  },
  topic: {
    type: String,
    
  },
  mentorTick: {
    type: Boolean,
    default: false,
  },
  parentTick: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("ClassRecord", classRecordSchema);
