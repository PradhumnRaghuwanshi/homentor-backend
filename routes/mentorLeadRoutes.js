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

router.get("/sorted-mentor-leads", async (req, res) => {
  const { lat, lon, subject, classLevel } = req.query;

  const adminLat = Number(lat);
  const adminLon = Number(lon);

  const mentors = await MentorLead.find();

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

    const strongMatch =
      isClassMatch &&
      isSubjectMatch
    
    return {
      ...m._doc,
      distance,
      convertedRange: numericRange,
      isInRange,
      isClassMatch,
      strongMatch,
      isSubjectMatch,
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

module.exports = router;
