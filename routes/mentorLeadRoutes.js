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

router.get("/", async (req, res) => {
  const leads = await MentorLead.find().sort({ createdAt: -1 });
  res.json(leads);
});

router.put("/:id", async (req, res) => {
  const lead = await MentorLead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(lead);
});

router.post("/second-form", async (req, res) => {
  const lead = await MentorLead.findOne(
    {phone : req.body.phone}
  );
  lead.secondForm = true
  lead.status = "second_form"
  await lead.save()
  res.json(lead);
});

router.get("/sorted-mentor-leads", async (req, res) => {
  try {
    const { lat, lon, subject, classLevel, experience, price } = req.query;

    const adminLat = Number(lat);
    const adminLon = Number(lon);
    const reqExperience = Number(experience);
    const reqPrice = Number(price);

    const mentors = await MentorLead.find();

    // -----------------------------
    // RANGE NORMALIZATION
    // -----------------------------
    function normalizeRange(range) {
      if (!range) return Infinity;

      const r = range.toLowerCase();
      if (r === "anywhere") return Infinity;
      if (r.endsWith("+")) return parseInt(r);
      return parseInt(r);
    }

    // -----------------------------
    // DISTANCE (HAVERSINE)
    // -----------------------------
    function getDistance(lat1, lon1, lat2, lon2) {
      if (!lat2 || !lon2) return Infinity;

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

    let enriched = mentors.map((m) => {
      const distance = getDistance(
        adminLat,
        adminLon,
        m.location?.lat,
        m.location?.lon
      );
      const numericRange = normalizeRange(m.teachingRange);
      console.log(`distance - ${distance}, range - ${numericRange}`)

      const isInRange = distance <= numericRange;

      // ---------------------------
      // CLASS & SUBJECT MATCH
      // ---------------------------
      let isClassMatch = true;
      let isSubjectMatch = true;

      const prefs = m.teachingPreferences?.school || {};

      if (classLevel) {
        isClassMatch = Object.keys(prefs)
          .map(k => k.toLowerCase())
          .includes(classLevel.toLowerCase());
      }

      if (subject && classLevel) {
        const subjects = prefs[classLevel] || [];
        isSubjectMatch = subjects
          .map(s => s.toLowerCase())
          .includes(subject.toLowerCase());
      }

      const strongMatch = isClassMatch && isSubjectMatch;

      // ---------------------------
      // EXPERIENCE & PRICE MATCH
      // ---------------------------
      const mentorExp = Number(m.teachingExperience || 0);
      const mentorPrice = Number(m.fees || Infinity);

      const isExperienceMatch =
        !reqExperience || mentorExp >= reqExperience;

      const isPriceMatch =
        !reqPrice || mentorPrice <= reqPrice;

      return {
        ...m._doc,
        distance,
        convertedRange: numericRange,
        isInRange,
        isClassMatch,
        isSubjectMatch,
        strongMatch,
        mentorExp,
        mentorPrice,
        isExperienceMatch,
        isPriceMatch,
      };
    });

    // -----------------------------
    // FILTER FIRST (IMPORTANT)
    // -----------------------------
    enriched = enriched.filter(m =>
      m.isExperienceMatch && m.isPriceMatch
    );

    // -----------------------------
    // FINAL SORTING PRIORITY
    // -----------------------------
    enriched.sort((a, b) => {
      // 1️⃣ Strong class + subject match
      if (a.strongMatch && !b.strongMatch) return -1;
      if (!a.strongMatch && b.strongMatch) return 1;

      // 2️⃣ In teaching range
      if (a.isInRange && !b.isInRange) return -1;
      if (!a.isInRange && b.isInRange) return 1;

      // 3️⃣ Higher experience first
      if (a.mentorExp !== b.mentorExp)
        return b.mentorExp - a.mentorExp;

      // 4️⃣ Lower price first
      if (a.mentorPrice !== b.mentorPrice)
        return a.mentorPrice - b.mentorPrice;

      // 5️⃣ Availability
      if (a.isAvailable && !b.isAvailable) return -1;
      if (!a.isAvailable && b.isAvailable) return 1;

      // 6️⃣ Nearest mentor
      return a.distance - b.distance;
    });

    res.json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const mentorLead = await MentorLead.findByIdAndDelete(req.params.id);
    if (!mentorLead) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json({ message: "Mentor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


module.exports = router;
