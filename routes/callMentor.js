const express = require("express");
const router = express.Router();
const CallMentor = require("../models/CallMentor");

// ✅ Store a new message
router.get('/mentor-call', async(req, res)=>{
  const allCall = await CallMentor.find()
  res.send(allCall)
})

router.post("/mentor-call", async (req, res) => {
  try {
    const newCallMentor = new CallMentor(req.body);
    await newCallMentor.save();
    res.status(201).json(newCallMentor);
  } catch (err) {
    console.error("Failed to save call mentor data:", err);
    res.status(500).json({ error: "Failed to save call mentor data" });
  }
});



module.exports = router;
