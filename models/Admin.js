const mongoose = require('mongoose');

const AdminCreationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  buildingName: { type: String, required: true },
  contactNumber: { type: Number, required: true },
});

module.exports = mongoose.model('AdminCreation', AdminCreationSchema);
