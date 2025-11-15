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

    for (let mentor of mentors) {
      const modes = mentor.teachingModes || {};

      for (let key in modes) {
        const price = modes[key].monthlyPrice;

        if (!price) continue;

        // find matching rule
        const rule = rules.find(r => price >= r.min && price <= r.max);

        if (rule) {
          modes[key].margin = rule.margin;
          modes[key].finalPrice = price + rule.margin;
        }
      }

      await mentor.save();
    }

    res.json({ success: true, message: "Margins applied successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
