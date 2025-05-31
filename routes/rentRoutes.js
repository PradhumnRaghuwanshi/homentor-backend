const express = require("express");
const moment = require('moment');
const router = express.Router();
const Rent = require("../models/Rent");
const Room = require("../models/Room");


// CREATE or Update Rent for a room
router.post("/", async (req, res) => {
  try {
    const { roomId, rentPaid, totalRentDue, totalRentPaid, rentStatus, electricity, unitConsumed, electricityAmountPaid } = req.body;

    // Check if rent record for the room already exists
    // const existing = await Rent.findOne({ room });

    // if (existing) {
    //   // Update existing rent
    //   const updated = await Rent.findOneAndUpdate(
    //     { room },
    //     { $set: { rentPaid, totalRentDue, totalRentPaid, rentStatus, electricity } },
    //     { new: true }
    //   );
    //   return res.status(200).json({ message: "Rent updated", data: updated });
    // }

    // // Create new rent record
    // const newRent = new Rent({ room, rentPaid, totalRentDue, totalRentPaid, rentStatus, electricity });
    // const saved = await newRent.save();

    const currentMonth = moment().format('MMMM');
    const currentYear = moment().year();

    const alloted_room = await Room.findById(roomId)

    // Update room rent status
    alloted_room.currentRentStatus = {
      month: currentMonth,
      year: currentYear,
      totalRent: alloted_room.rent,
      rentPaid: rentPaid,
      rentDue: alloted_room.currentRentStatus.rentDue - rentPaid,
      paidOn:  new Date(),
      electricity: {
        unitsConsumed: unitConsumed,
        amountDue: alloted_room.currentRentStatus.electricity.amountDue - electricityAmountPaid,
        amountPaid: electricityAmountPaid,
        status: alloted_room.currentRentStatus.electricity.amountDue - electricityAmountPaid == 0 ? 'paid' : 'unpaid',
      },
      status: alloted_room.currentRentStatus.rentDue == 0 ? 'paid' : "unpaid",
    };
    await alloted_room.save()


    res.status(201).json({ message: "Rent created", data: alloted_room });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all rent records
router.get("/", async (req, res) => {
  try {
    const rents = await Rent.find().populate("room", "roomNumber type rent");
    res.status(200).json({ data: rents });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET rent by room ID
router.get("/:roomId", async (req, res) => {
  try {
    const rent = await Rent.findOne({ room: req.params.roomId }).populate("room", "roomNumber type rent");
    if (!rent) {
      return res.status(404).json({ message: "Rent record not found" });
    }
    res.status(200).json({ data: rent });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE rent by room ID
router.delete("/:roomId", async (req, res) => {
  try {
    const deleted = await Rent.findOneAndDelete({ room: req.params.roomId });
    if (!deleted) {
      return res.status(404).json({ message: "Rent not found" });
    }
    res.status(200).json({ message: "Rent deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
