const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");

// ✅ Store a new message
router.get('/', async(req, res)=>{
  const allMessages = await ChatMessage.find()
  res.send(allMessages)
})

router.post("/store", async (req, res) => {
  try {
    const newMessage = new ChatMessage(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error("Failed to save chat message:", err);
    res.status(500).json({ error: "Failed to save chat message" });
  }
});

// ✅ Get chat history between 2 users (parent and mentor)
router.post("/history", async (req, res) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ error: "Both user1 and user2 are required." });
  }

  try {
    const chatHistory = await ChatMessage.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(chatHistory);
  } catch (err) {
    console.error("Failed to fetch chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

module.exports = router;
