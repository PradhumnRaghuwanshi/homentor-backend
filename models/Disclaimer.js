const mongoose = require ("mongoose");

const disclaimerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      enum: ["parent", "mentor"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Disclaimer", disclaimerSchema);
