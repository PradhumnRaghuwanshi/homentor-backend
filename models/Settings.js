const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notificationsEnabled: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  profilePicture: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
