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
router.post("/login-check", async (req, res) => {
  try {
    const mentor = await Mentor.findOne({phone : req.body.phone})
    if (!mentor){
      res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json({ data: mentor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/selected-mentors', async (req, res) => {
  try {
    const idsParam = req.query.id;

    if (!idsParam) return res.status(400).json({ error: 'No IDs provided' });

    const idsArray = idsParam.split(',').map((id) => id.trim());

    // Assuming you're using Mongoose and your model is Mentor
    const mentors = await Mentor.find({ _id: { $in: idsArray } });

    res.json({ mentors });
  } catch (err) {
    console.error('Error fetching mentors:', err);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

router.get('/pending-mentors', async(req, res)=>{
  const pendingMentors = await Mentor.find({
    status : "Pending"
  })
  res.status(200).json({data: pendingMentors})
})

router.get('/approved-mentors', async(req, res)=>{
  const pendingMentors = await Mentor.find({
    status : "Approved"
  })
  res.status(200).json({data: pendingMentors})
})

router.get('/visible-mentors', async(req, res)=>{
  const visibleMentors = await Mentor.find({
    status : "Approved",
    showOnWebsite : true
  })
  res.status(200).json({data: visibleMentors})
})

router.get('/gold-mentor', async(req, res)=>{
  const goldMentors = await Mentor.find({
    status : "Approved",
    showOnWebsite : true,
    inHouse : true
  })
  res.status(200).json({data: goldMentors})
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
    console.log(req.body)
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

    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.status(200).json({ data: mentor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
