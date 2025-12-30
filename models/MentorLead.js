const mongoose = require("mongoose");

const mentorLeadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    location: {
      city: String,
      area: String,
    },

    teachingRange: {
      type: String, // example: "Class 6–10 Maths, Science"
    },

    bio: {
      type: String,
    },

    category: {
      type: String,
      enum: ["Premium", "Regular", "Trial"],
      default: "Regular",
    },

    fees: {
      type: Number,
    },

    leadFormFilled: {
      type: Boolean,
      default: false,
    },

    interviewDone: {
      type: Boolean,
      default: false,
    },

    teachingPreferences: {
      type: Object
    },

    teachingExperience: {
      type : String
    },
    
    urgentlyNeeded: {
      type: Boolean,
      default: false,
    },
    whatsappAdded : {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentorLead", mentorLeadSchema);
