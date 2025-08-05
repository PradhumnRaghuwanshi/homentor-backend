const express = require("express");
const router = express.Router();
const ClassRecord = require("../models/ClassRecord");

// GET all classRecords
router.get("/", async (req, res) => {
  try {
    const classRecords = await ClassRecord.find()
    res.status(200).json({ data: classRecords });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", async (req, res) => {
  try {
    console.log(req.body)
    const classRecord = ClassRecord(req.body)
    await classRecord.save()
    res.status(200).json({ data: classRecord });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router