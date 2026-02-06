const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true, unique: true },
  gender: { type: String },
  age: { type: Number },
  profilePhoto: { type: String },
  teachingVideo: String,
  cv: String,
  aadharPhoto: String,
  panPhoto: String,
  marksheet: String,
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
    specialization: String,
    graduationYear: Number
  },
  otherGraduationDegree: String,
  postGraduation: {
    degree: String,
    college: String,
  },
  alternatePhone: Number,
  referenceContact: Number,
  permanentAddress: String,
  temporaryAddress: String,
  panNumber: String,
  bankAccount: Number,
  ifsc: String,
  accountHolderName: String,
  location: {
    area: String,
    city: String,
    state: String,
    lat: Number,
    lon: Number,
  },
  experience: { type: String },
  experienceDisplay: {
    type: Boolean,
    default: false,
  },
  teachingRange: {
    type: String,
    default: "3 km",
  },
  // teachingModes: Object,
  teachingModes: {
    homeTuition: {
      selected: { type: Boolean, default: false },
      monthlyPrice: { type: Number }, // mentor’s entered fee
      margin: { type: Number, default: 0 },           // system-calculated margin
      finalPrice: { type: Number, default: 0 }        // monthlyPrice + margin
    }
  },
  teachingPreferences: Object,
  availableDays: {
    type: [String],
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
  demoType: {
    type: String,
    enum: ["free", "paid", "none"], // free => Free demo, paid => 99rs demo, none => hide both
    default: "free"
  },
  backupTeachers: { type: Array },
  callRouting: {
    mode: { type: String, enum: ["mentor", "company"], default: "company" }
  },
  // ⭐ Add this block
  coordinates: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], index: "2dsphere", default: [0, 0] },
  },
  category: {
    type: String,
    enum: ["gold", "silver", "budget"],
    default: "silver"
  },
  lastActive: Date,
  lastActivityText: String,
  isViewedByAdmin: {
    type: Boolean,
    default: false
  }
});

MentorSchema.index({ coordinates: "2dsphere" });


module.exports = mongoose.model("Mentor", MentorSchema);
