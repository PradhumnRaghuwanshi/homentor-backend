const express = require("express");
const router = express.Router();
const ClassRecord = require("../models/ClassRecord");
const ClassBooking = require("../models/ClassBooking");

// GET all classRecords
router.get("/", async (req, res) => {
  try {
    const classRecords = await ClassRecord.find()
    res.status(200).json({ data: classRecords });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/class-booking/:id", async (req, res) => {
  try {
    const classRecords = await ClassRecord.find({
        classBooking : req.params.id
    })
    res.status(200).json({ data: classRecords });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const classRecords = await ClassRecord.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({ data: classRecords });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const classRecord = new ClassRecord(req.body);
    await classRecord.save();

    let classBooking = await ClassBooking.findOne({_id : classRecord.classBooking})
    console.log(classBooking)
    classBooking.progress = classBooking.progress + 1
    classBooking.classesRecord.push(classRecord._id)
    await classBooking.save()
    
    res.status(200).json({ data: classRecord });
  } catch (error) {
    console.error("Error saving class record:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

module.exports = router