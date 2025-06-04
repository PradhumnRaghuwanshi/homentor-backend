const express = require('express');
const Message = require('./models/Message');
const router = express.Router();

router.post('/get-messages', async (req, res) => {
  const { from, to } = req.body;
  const messages = await Message.find({
    $or: [
      { senderId: from, receiverId: to },
      { senderId: to, receiverId: from },
    ]
  }).sort({ timestamp: 1 });

  res.json(messages);
});

router.post('/add-message', async (req, res) => {
  const { from, to, message } = req.body;
  const newMessage = await Message.create({ senderId: from, receiverId: to, message });
  res.status(201).json(newMessage);
});

module.exports = router;
