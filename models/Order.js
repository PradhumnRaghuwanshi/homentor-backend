// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: String,
  amount: Number,
  userPhone: String,
  status: { type: String, default: "PENDING" }, // PENDING, PAID, FAILED
  verifiedAt: Date,
});

module.exports = mongoose.model("Order", OrderSchema);
