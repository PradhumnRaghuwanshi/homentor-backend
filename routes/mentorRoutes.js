const express = require("express");
const router = express.Router();
const Mentor = require("../models/Mentor");

// GET all mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find()
    res.status(200).json({ data: mentors });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/pending-mentors', async(req, res)=>{
  const pendingMentors = await Mentor.find({
    status : "Pending"
  })
  res.status(200).json({data: pendingMentors})
})

// GET mentor by ID
router.get("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate("student", "name email");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json({ data: mentor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST new mentor
router.post("/", async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    const newMentor = await mentor.save();
    res.status(201).json({ data: newMentor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT resolve mentor
router.put("/:id", async (req, res) => {
  try {
    const { adminRanking } = req.body;

    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { adminRanking },
      { new: true } // return the updated document
    );

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json({ data: mentor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
