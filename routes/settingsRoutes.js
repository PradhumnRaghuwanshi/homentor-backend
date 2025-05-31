const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Settings = require('../models/Settings');

// GET current settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    res.status(200).json({ data: settings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE settings
router.put('/:id', async (req, res) => {
  try {
    const updatedSettings = await Settings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSettings) return res.status(404).json({ message: 'Settings not found' });
    res.status(200).json({ data: updatedSettings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CHANGE PASSWORD securely
router.put('/change-password/:id', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await Settings.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;

    await admin.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
