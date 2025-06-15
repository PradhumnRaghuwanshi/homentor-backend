const express = require('express')
const cors =  require('cors')
const connectDB = require('./configDB/db')
const http = require('http');
const { Server } = require("socket.io");
const setupSocket = require('./routes/socket');

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
const phonePeRoutes = require('./routes/phonepe');
app.use('/api', phonePeRoutes);
app.use('/admin',adminRoutes)
app.use('/users',userRoutes)
app.use('/api/mentor',mentorRoutes)
app.use('foodmenu', require('./routes/menuRoutes'))
app.use('/api', require('./routes/twilioRoutes'))
app.use('/api', require('./routes/payment'))
app.use("/api/chat", chatRoutes);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server with socket.io running on port ${PORT}`);
});