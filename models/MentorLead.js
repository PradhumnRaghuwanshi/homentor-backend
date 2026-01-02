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
      state: String,
      city: String,
      area: String,
      lat: Number,
      lon: Number
    },

    teachingRange: {
      type: String,
    },

    bio: {
      type: String,
    },

    category: {
      type: String,
      enum: ["Premium", "Regular", "Trial"],
      default: "Regular",
    },
    status: {
      type: String,
      enum: ["lead_generated" ,"first_form", "interview", "second_form", "link_send", "call_done", "demo_booked", "paid_booking"],
      default: "lead_generated",
    },

    fees: {
      type: Number,
    },

    leadFormFilled: {
      type: Boolean,
      default: false,
    },

    secondForm: {
      type: Boolean,
      default: false,
    },
    linkSend: {
      type: Boolean,
      default: false,
    },
    isCalled: {
      type: Boolean,
      default: false,
    },
    demoBooked : {
      type: Boolean,
      default: false,
    },
    paidBooked : {
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
      type: String
    },

    urgentlyNeeded: {
      type: Boolean,
      default: false,
    },
    whatsappAdded: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentorLead", mentorLeadSchema);
