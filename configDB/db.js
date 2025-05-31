const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://palashgoud84:pDXr2aSiI0Bwmxuz@cluster0.wa6lc.mongodb.net/homentor")
    console.log("MongoDB Connected:");
  } catch (error) {
    console.error(error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
