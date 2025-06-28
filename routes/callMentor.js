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

router.put("/mentor-call/:id", async (req, res) => {
  try {
    const oldCallData = await CallMentor.findById(req.params.id);
    await oldCallData.save();
    res.status(201).json(oldCallData);
  } catch (err) {
    console.error("Failed to save parent data:", err);
    res.status(500).json({ error: "Failed to save parent data" });
  }
});





module.exports = router;
