const express = require("express");
const router = express.Router();
const MarginRule = require("../models/MarginRule");
const Mentor = require("../models/Mentor");

router.post("/margin-rules", async (req, res) => {
  try {
    const { min, max, margin } = req.body;

    const rule = await MarginRule.create({ min, max, margin });

    res.json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/margin-rules", async (req, res) => {
  try {
    const rules = await MarginRule.find().sort({ min: 1 });
    res.json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/apply-margins", async (req, res) => {
  try {
    const rules = await MarginRule.find();
    const mentors = await Mentor.find();

    if (!rules.length) {
      return res.status(400).json({ message: "No margin rules found" });
    }

    for (const mentor of mentors) {
      const ht = mentor.teachingModes?.homeTuition;

      // If no homeTuition mode or no monthlyPrice → skip
      if (!ht || typeof ht.monthlyPrice !== "number") continue;

      const price = ht.monthlyPrice;

      // Find matching rule
      const rule = rules.find(
        (r) => price >= r.min && price <= r.max
      );

      // If no rule matches → skip
      if (!rule) continue;

      // Apply margin & final price
      ht.margin = rule.margin;
      ht.finalPrice = price + rule.margin;

      mentor.teachingModes.homeTuition = ht;
      await mentor.save();
    }

    res.json({ success: true, message: "Margins applied successfully" });

  } catch (err) {
    console.error("Margin apply error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


module.exports = router;
