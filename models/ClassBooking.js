// models/ClassBooking.js
const mongoose = require("mongoose");

const classBookingSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  mentorName: { type: String, required: true },
  mentorImage: { type: String, default: "/placeholder.svg" },
  subject: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending_schedule", "scheduled", "completed", "cancelled"],
    default: "pending_schedule",
  },
  bookedDate: { type: Date, required: true },
  scheduledDate: { type: Date },
  scheduledTime: { type: String },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  type: {
    type: String,
    enum: ["one-on-one", "consultation"],
    required: true,
  },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ClassBooking", classBookingSchema);
