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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParentLead", parentLeadSchema);
