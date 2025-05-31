// models/Expenses.js
const mongoose = require('mongoose');

const ExpensesSchema = new mongoose.Schema({
  cleaner: Number,
  maintainance: Number,
  water: Number,
  electricity: Number,
  date: { type: Date, required: true } // ✅ Add this
});

module.exports = mongoose.model('Expenses', ExpensesSchema);
