const mongoose = require("mongoose");

const parentLeadSchema = new mongoose.Schema(
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

    classes: {
      type: String, 
    },

    subjects: {
      type: String,
    },

    feesBudget: {
      type: Number,
    },

    classRequiredDate: {
      type: Date,
    },

    additionalDetails: {
      type: String
    },

    firstInteractionDate: {
      type: Date
    },

    lastInteractionDate: {
      type: Date
    },

    school: {
      type : String
    },
    
    isGold : {
      type: Boolean,
      default: false,
    },
    teacherLink : {
      type: Boolean,
      default: false,
    },
    isCalled : {
      type: Boolean,
      default: false
    },
    demoBooked : {
      type: Boolean,
      default: false,
    },
    paidBooked : {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["lead_generated" ,"first_form", "interview", "second_form", "link_send", "call_done", "demo_booked", "paid_booking"],
      default: "lead_generated",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParentLead", parentLeadSchema);
