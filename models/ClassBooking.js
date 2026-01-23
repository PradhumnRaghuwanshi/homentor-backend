// models/ClassBooking.js
const mongoose = require("mongoose");

const teacherHistorySchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  fullName: { type: String },
  phone: { type: Number },
  perClassPrice: {
    type: Number,
    required: true,
  },
  classesTaken: {
    type: Number,
    default: 0,
  },
  amountToPay: {
    type: Number,
    default: 0,
  },
  switchedAt: {
    type: Date,
    default: Date.now,
  }
});

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
    enum: ["pending_schedule", "scheduled", "running", "completed", "cancelled", "terminated"],
    default: "pending_schedule",
  },
  bookedDate: { type: Date, required: true, default: Date.now },
  scheduledDate: { type: Date },
  scheduledTime: { type: String },
  duration: { type: String, default: "22" },
  price: { type: Number, required: true },
  commissionPrice: { type: Number },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  studentName: { type: String },
  class: { type: String },
  school: { type: String },
  classesRecord: Array,
  progress: {
    type: Number,
    default: 0   // number of completed lectures
  },
  refundAmount: { type: Number, default: 0 },
  terminatedAt: { type: Date },
  isCompleted: {
    type: Boolean,
    default: false
  },
  // NEW → Tracks all teachers who taught this booking
  teacherHistory: [teacherHistorySchema],
  mentorCompletion: {
    type: Boolean,
    default: false
  },
  currentPerClassPrice: {
    type: Number,
    // required: true
  },
  remainingClasses: {
    type: Number,
    // required: true
  },
  adminApproved: {
    type: Boolean,
    default: false
  },

  parentCompletion: {
    type: Boolean,
    default: false
  },
  session: { type: Number, default: 1 },
  feedback: { type: String },
  isDemo: { type: Boolean, default: false },
  demoStatus: { type: String, default: "not-demo" },
  sessionContinued: { type: Boolean, default: "false" },
  isViewedByAdmin: {
    type: Boolean,
    default: false
  }

});



module.exports = mongoose.model("ClassBooking", classBookingSchema);
