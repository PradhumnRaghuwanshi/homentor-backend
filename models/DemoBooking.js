const mongoose = require("mongoose");

const demoBookingSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    parentPhone: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
    //   required: true,
    },
    address: {
      type: String,
    //   required: true,
    },
    fee: {
      type: Number,
      enum: [0, 99], // only free or 99 allowed
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DemoBooking", demoBookingSchema);
