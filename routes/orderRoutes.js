const Order = require("../models/Order")
const express = require("express")
const router = express.Router()

// ✅ Get all orders (admin use)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("mentor", "name photo")
      .populate("parent", "name phone");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router