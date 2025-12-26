const express = require("express") ;
const Disclaimer = require("../models/Disclaimer.js");

const router = express.Router();

/* =======================
   ADMIN ROUTES
======================= */


router.post("/", async (req, res) => {
  try {
    const disclaimer = await Disclaimer.create(req.body);
    res.json({ success: true, data: disclaimer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update disclaimer
router.put("/:id", async (req, res) => {
  try {
    const disclaimer = await Disclaimer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: disclaimer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete disclaimer
router.delete("/:id", async (req, res) => {
  await Disclaimer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* =======================
   PUBLIC ROUTE
======================= */

// Get disclaimer by audience
router.get("/:audience", async (req, res) => {
  const disclaimer = await Disclaimer.findOne({
    audience: req.params.audience,
  });
  res.json({ success: true, data: disclaimer });
});

module.exports = router;
