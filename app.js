const express = require('express')
const cors =  require('cors')
const connectDB = require('./configDB/db')
const http = require('http');
const { Server } = require("socket.io");
const setupSocket = require('./routes/socket');
const otpRoutes = require("./routes/otpRoutes");

connectDB()
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')
const mentorRoutes = require('./routes/mentorRoutes')
const chatRoutes = require("./routes/chatRoutes");

const app= express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:8080" },
  methods: ["GET", "POST"]
});

setupSocket(io);
app.use(cors())
app.use(express.json())
// Routes
app.use("/api/otp", otpRoutes);
app.use("/api/class-bookings", require('./routes/classBooking.js'));
app.use('/api/admin', adminRoutes)
app.use('/api/users',userRoutes)
app.use('/api', require('./routes/authRoutes'))
app.use('/api', require('./routes/callMentor'))
app.use('/api/mentor',mentorRoutes)
app.use("/api/chat", chatRoutes);
app.use("/api/payment", require("./routes/cashfreePayment.js"));
app.use("/api/order", require("./routes/orderRoutes.js"));


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server with socket.io running on port ${PORT}`);
});