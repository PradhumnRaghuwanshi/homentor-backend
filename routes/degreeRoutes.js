const express = require("express");
const router = express.Router();
const Degree = require("../models/Degree");

/* ➕ Add Degree */
router.post("/", async (req, res) => {
  try {
    const { name, subjects } = req.body;

    const degree = await Degree.create({
      name,
      subjects,
    });

    res.json({ success: true, data: degree });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* 📥 Get All */
router.get("/", async (req, res) => {
  const list = await Degree.find().sort({ createdAt: -1 });
  res.json({ success: true, data: list });
});


/* ✏️ Update */
router.put("/:id", async (req, res) => {
  const updated = await Degree.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, data: updated });
});


/* ❌ Delete */
router.delete("/:id", async (req, res) => {
  await Degree.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

module.exports = router;
