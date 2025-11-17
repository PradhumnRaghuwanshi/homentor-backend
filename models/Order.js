// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
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
  amount: Number,
  userPhone: String,
  status: { type: String, default: "PENDING" }, // PENDING, PAID, FAILED
  verifiedAt: Date,
  duration : {type: Number, default: null},
  classBookig : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "classBooking"
  },
  isDemo: {type : Boolean, default: false}
});

module.exports = mongoose.model("Order", OrderSchema);
