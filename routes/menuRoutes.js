const express = require("express");
const router = express.Router();
const Foodmenu = require("../models/Foodmenu");  // Updated model name

// GET all menus
router.get("/", async (req, res) => {
  try {
    const menus = await Foodmenu.find();  // Use Foodmenu here
    res.status(200).json({ data: menus });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET today's menu
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const menu = await Foodmenu.findOne({ date: today });  // Use Foodmenu here
    if (!menu) {
      return res.status(404).json({ message: "Menu not found for today" });
    }
    res.status(200).json({ data: menu });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST new menu
router.post("/", async (req, res) => {
  try {
    const menu = new Foodmenu(req.body);  // Use Foodmenu here
    const newMenu = await menu.save();
    res.status(201).json({ data: newMenu });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update menu by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedMenu = await Foodmenu.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Use Foodmenu here
    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.status(200).json({ data: updatedMenu });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
