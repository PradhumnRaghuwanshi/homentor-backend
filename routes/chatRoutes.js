const express = require("express");
const ChatMessage = require("../models/ChatMessage");
const router = express.Router();

router.post("/history", async (req, res) => {
  const { sender, receiver } = req.body;

  const messages = await ChatMessage.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender }
    ]
  }).sort({ timestamp: 1 });

  res.json(messages);
});

router.post("/store", async (req, res) => {
  const { sender, receiver, message } = req.body;
  const chat = await ChatMessage.create({ sender, receiver, message });
  res.status(201).json(chat);
});

module.exports = router;
