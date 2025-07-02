const mongoose = require('mongoose');

const AdminCreationSchema = new mongoose.Schema({
  callingNo : Number
});

module.exports = mongoose.model('AdminCreation', AdminCreationSchema);
