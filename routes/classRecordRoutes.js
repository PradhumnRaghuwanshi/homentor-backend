router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    // 1️⃣ Save class record first
    const classRecord = new ClassRecord(req.body);
    await classRecord.save();

    // 2️⃣ Fetch ClassBooking
    let classBooking = await ClassBooking.findOne({ _id: classRecord.classBooking });

    if (!classBooking) {
      return res.status(404).json({ message: "Class Booking not found" });
    }

    // Ensure totalProgressMinutes field exists
    if (!classBooking.totalProgressMinutes) {
      classBooking.totalProgressMinutes = 0;
    }

    // 3️⃣ Convert duration "H:MM" → total minutes
    const durationStr = req.body.duration; // example "1:10"
    let [hours, minutes] = durationStr.split(":").map(Number);

    const totalMinutes = hours * 60 + minutes;

    // 4️⃣ Add this duration to total progress
    classBooking.progress += totalMinutes;

    // 5️⃣ Push record ID inside booking
    classBooking.classesRecord.push(classRecord._id);

    // 6️⃣ Save booking
    await classBooking.save();

    res.status(200).json({ data: classRecord });

  } catch (error) {
    console.error("Error saving class record:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});
