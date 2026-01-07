const express = require("express");
const router = express.Router();
const Mentor = require("../models/Mentor");
const MentorLead = require("../models/MentorLead");

router.get("/nearby-mentors", async (req, res) => {
  const { lat, lon, subject, classLevel, rank } = req.query;

  const adminLat = Number(lat);
  const adminLon = Number(lon);

  const mentors = await Mentor.find();

  // Convert teaching range "5km" / "25km+" / "anywhere"
  function normalizeRange(range) {
    if (!range) return Infinity;

    let r = range.toLowerCase();

    if (r === "anywhere") return Infinity;
    if (r.endsWith("+")) return parseInt(r); // "25km+" → 25

    return parseInt(r); // "5km" → 5
  }

  // Distance calculator (Haversine)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  let enriched = mentors.map(m => {
    const distance = getDistance(
      adminLat,
      adminLon,
      m.location?.lat,
      m.location?.lon
    );

    const numericRange = normalizeRange(m.teachingRange);
    const isInRange = distance <= numericRange;

    // ---------------------------
    // CLASS & SUBJECT FILTER LOGIC
    // ---------------------------

    let isClassMatch = true;
    let isSubjectMatch = true;

    const prefs = m.teachingPreferences?.school || {};

    // If class filter applied
    if (classLevel) {
      const classKey = String(classLevel).toLowerCase();

      isClassMatch = Object.keys(prefs)
        .map(k => k.toLowerCase())
        .includes(classKey);
    }

    // If subject filter applied
    if (subject && classLevel) {
      const subjects = prefs[classLevel] || [];

      isSubjectMatch = subjects
        .map(s => s.toLowerCase())
        .includes(subject.toLowerCase());
    }

    // RANK FILTER
    const isRankMatch = rank ? Number(m.adminRanking) === Number(rank) : true;

    const strongMatch =
      isClassMatch &&
      isSubjectMatch &&
      isRankMatch;

    return {
      ...m._doc,
      distance,
      convertedRange: numericRange,
      isInRange,
      isClassMatch,
      isSubjectMatch,
      isRankMatch,
      strongMatch,
    };
  });

  // FINAL SORTING PRIORITY
  enriched.sort((a, b) => {
    // 1️⃣ Strong match first (class + subject + rank)
    if (a.strongMatch && !b.strongMatch) return -1;
    if (!a.strongMatch && b.strongMatch) return 1;

    // 2️⃣ In teaching range
    if (a.isInRange && !b.isInRange) return -1;
    if (!a.isInRange && b.isInRange) return 1;

    // 3️⃣ Available mentors first
    if (a.isAvailable && !b.isAvailable) return -1;
    if (!a.isAvailable && b.isAvailable) return 1;

    // 4️⃣ Nearest first
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

router.get('/rejected-mentors', async (req, res) => {
  const rejectedMentors = await Mentor.find({
    status: "Rejected"
  })
  res.status(200).json({ data: rejectedMentors })
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

router.post("/", async (req, res) => {
  try {
    // ✅ 1. Normalize mobile number (last 10 digits only)
    if (req.body.phone) {
      const digitsOnly = req.body.phone.replace(/\D/g, "");
      req.body.phone = digitsOnly.slice(-10);
    }

    const mentor = new Mentor(req.body);

    // ✅ 2. Handle monthlyPrice safely (allow empty)
    const monthlyPrice =
      mentor.teachingModes?.homeTuition?.monthlyPrice;

    if (typeof monthlyPrice === "number") {
      mentor.teachingModes.homeTuition.margin =
        monthlyPrice <= 5000 ? 500 : 1000;

      mentor.teachingModes.homeTuition.finalPrice =
        monthlyPrice + mentor.teachingModes.homeTuition.margin;
    } else {
      // If monthlyPrice not provided
      mentor.teachingModes.homeTuition.margin = 0;
      mentor.teachingModes.homeTuition.finalPrice = 0;
    }

    const newMentor = await mentor.save();

    const mentorLead = await MentorLead.find({
      phone : req.body.phone
    }) 
    if(mentorLead){
      mentorLead.leadFormFilled = true
      mentorLead.status = "first_form"
      await mentorLead.save()
    } else {
      let newMentorLead = new MentorLead(req.body)
      newMentorLead.leadFormFilled = true
      newMentorLead.status = "first_form"
      await newMentorLead.save()
    }
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
