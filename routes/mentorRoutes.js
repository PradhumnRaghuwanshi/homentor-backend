const express = require("express");
const router = express.Router();
const Mentor = require("../models/Mentor");

router.get("/nearby-mentors", async (req, res) => {
  const { lat, lon } = req.query;

  const adminLat = Number(lat);
  const adminLon = Number(lon);

  const mentors = await Mentor.find();

  // Convert teaching range "5km" / "25km+" / "anywhere"
  function normalizeRange(range) {
    if (!range) return Infinity;

    range = range.toLowerCase();

    if (range === "anywhere") return Infinity;

    if (range.endsWith("+")) {
      return parseInt(range); // "25km+" -> 25
    }

    return parseInt(range); // "5km" -> 5
  }

  // Haversine distance calculator
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // km
  }

  let enriched = mentors.map(m => {
    const distance = getDistance(adminLat, adminLon, m.location.lat, m.location.lon);

    const numericRange = normalizeRange(m.teachingRange);

    const isInRange = distance <= numericRange;

    return {
      ...m._doc,
      distance,
      convertedRange: numericRange,
      isInRange,
    };
  });

  // Sorting logic:
  // 1. In-range mentors first
  // 2. Then by nearest distance
  // 3. Then available ones above unavailable
  enriched.sort((a, b) => {

    // 1️⃣ In-range priority
    if (a.isInRange && !b.isInRange) return -1;
    if (!a.isInRange && b.isInRange) return 1;

    // 2️⃣ Available mentors first
    if (a.isAvailable && !b.isAvailable) return -1;
    if (!a.isAvailable && b.isAvailable) return 1;

    // 3️⃣ Finally, nearest first
    return a.distance - b.distance;
  });

  res.json(enriched);
});



// GET all mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find()
    res.status(200).json({ data: mentors });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update all mentors demoType at once
router.put("/demoType/:type", async (req, res) => {
  try {
    const { type } = req.params;

    if (!["free", "paid", "none"].includes(type)) {
      return res.status(400).json({ message: "Invalid demoType" });
    }

    await Mentor.updateMany({}, { demoType: type });

    res.json({ message: `All mentors updated to demoType: ${type}` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login-check", async (req, res) => {
  try {
    console.log(req.body.phone)
    const mentor = await Mentor.findOne({ phone: req.body.phone })
    if (!mentor) {
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

router.get('/pending-mentors', async (req, res) => {
  const pendingMentors = await Mentor.find({
    status: "Pending"
  })
  res.status(200).json({ data: pendingMentors })
})

router.get('/approved-mentors', async (req, res) => {
  const pendingMentors = await Mentor.find({
    status: "Approved"
  })
  res.status(200).json({ data: pendingMentors })
})

router.get('/visible-mentors', async (req, res) => {
  const visibleMentors = await Mentor.find({
    status: "Approved",
    showOnWebsite: true
  })
  res.status(200).json({ data: visibleMentors })
})

router.get('/gold-mentor', async (req, res) => {
  const goldMentors = await Mentor.find({
    status: "Approved",
    showOnWebsite: true,
    inHouse: true
  })
  res.status(200).json({ data: goldMentors })
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
router.post("/batch", async (req, res) => {
  try {
    const mentorIds = req.body.ids;   // receives ["id1", "id2", "id3"]

    const mentors = await Mentor.find({
      _id: { $in: mentorIds }
    }).select("fullName phone profilePhoto teachingModes phone");

    res.json({ success: true, mentors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new mentor
router.post("/", async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    // Inside mentor signup controller
    mentor.teachingModes.homeTuition.margin = mentor.teachingModes.homeTuition.monthlyPrice <= 5000 ? 500 : 1000;

    mentor.teachingModes.homeTuition.finalPrice = mentor.teachingModes.homeTuition.monthlyPrice + mentor.teachingModes.homeTuition.margin;
    const newMentor = await mentor.save();
    res.status(201).json({ data: newMentor });
  } catch (error) {
    console.log(error)
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
