const express = require("express");
const MentorLead = require("../models/MentorLead.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const lead = await MentorLead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET ALL LEADS
 */
router.get("/", async (req, res) => {
  const leads = await MentorLead.find().sort({ createdAt: -1 });
  res.json(leads);
});

/**
 * UPDATE LEAD
 */
router.put("/:id", async (req, res) => {
  const lead = await MentorLead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(lead);
});

module.exports = router;
