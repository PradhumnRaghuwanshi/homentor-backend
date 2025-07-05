const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  profilePhoto: {
    type: String,
  },
  mentorId: String,
  teachingVideo: String,
  cv: String,
  qualifications: {
    highestQualification: String,
    specialization: String,
    university: String,
    graduationYear: Number,
    display: { type: Boolean, default: false },
  },
  twelfthStream: String, // new
  twelfthBoard: String,
  graduation: {
    degree: String,
    college: String,
  },
  postGraduation: {
    degree: String,
    college: String,
  },
  experience: String,
  location: {
    area: String,
    city: String,
    state: String,
    lat: Number,
    lon: Number,
  },
  experience: {
    type: String, // in years
  },
  experienceDisplay: {
    type: Boolean,
    default: false,
  },
  teachingRange: {
    type: String,
    default: "3 km",
  },
  teachingModes: Object,
  teachingPreferences: Object,
  availableDays: {
    type: [String],
    required: true, // e.g. "Weekdays 6-9 PM"
  },
  isAvailable: {
    type: Boolean,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  brief: String,
  teachingExperience: String,
  adminBrief: String,
  adminBriefVisible: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  adminRanking: {
    type: Number,
  },
  rating: Number,
  inHouse: {
    type: Boolean,
    default: false,
  },
  showOnWebsite: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Mentor", MentorSchema);
