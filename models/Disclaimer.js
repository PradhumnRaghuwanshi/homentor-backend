import mongoose from "mongoose";

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

export default mongoose.model("Disclaimer", disclaimerSchema);
