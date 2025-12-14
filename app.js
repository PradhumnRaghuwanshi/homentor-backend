const express = require('express')
const cors =  require('cors')
const connectDB = require('./configDB/db')

connectDB()
const app = express()
app.use(cors())
app.use(express.json())


// Routes
app.use("/api/otp", require("./routes/otpRoutes"));
app.use("/api/class-bookings", require('./routes/classBooking.js'));
app.use("/api/class-records", require('./routes/classRecordRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api', require('./routes/callMentor'))
app.use('/api/mentor',require('./routes/mentorRoutes'))
app.use("/api/payment", require("./routes/cashfreePayment.js"));
app.use("/api/order", require("./routes/orderRoutes.js"));
app.use("/api/margin-rule", require("./routes/marginRule.js"));
app.use("/api/demo-booking", require("./routes/demoBookingRoutes.js"));


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server with socket.io running on port ${PORT}`);
});