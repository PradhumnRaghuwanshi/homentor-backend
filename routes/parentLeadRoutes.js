const express = require("express");
const ParentLead = require("../models/ParentLead.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const lead = await ParentLead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  const leads = await ParentLead.find().sort({ createdAt: -1 });
  res.json(leads);
});

router.put("/:id", async (req, res) => {
  const lead = await ParentLead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(lead);
});


module.exports = router;
