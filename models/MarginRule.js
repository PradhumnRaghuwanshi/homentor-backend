const mongoose = require("mongoose");

const marginRuleSchema = new mongoose.Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  margin: { type: Number, required: true },
});

module.exports = mongoose.model("MarginRule", marginRuleSchema);
