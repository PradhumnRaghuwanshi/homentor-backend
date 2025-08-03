// models/ClassBooking.js
const mongoose = require("mongoose");

const classBookingSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  subject: { type: String },
  status: {
    type: String,
    enum: ["pending_schedule", "scheduled", "completed", "cancelled"],
    default: "pending_schedule",
  },
  bookedDate: { type: Date, required: true, default: Date.now },
  scheduledDate: { type: Date },
  scheduledTime: { type: String },
  duration: { type: String, default : "22" },
  price: { type: Number, required: true },
  type: {
    type: String,
    enum: ["one-on-one", "consultation"],

  },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ClassBooking", classBookingSchema);
