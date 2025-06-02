const express = require('express')
const cors =  require('cors')
const connectDB = require('./configDB/db')
connectDB()
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')
const roomRoutes = require('./routes/roomRoutes')
const menuRoutes = require('./routes/menuRoutes')
const expensesRoutes = require('./routes/expensesRoutes')
const mentorRoutes = require('./routes/mentorRoutes')
const rentRoutes = require("./routes/rentRoutes");
const noticeRoutes = require("./routes/noticesRoutes");
const app= express()
const port = 5001
app.use(cors())
app.use(express.json())
app.use('/admin',adminRoutes)
app.use('/users',userRoutes)
app.use('/rooms',roomRoutes)
app.use('/menu',menuRoutes)
app.use('/api/mentor',mentorRoutes)
app.use('/expenses',expensesRoutes)
app.use("/rents", rentRoutes);
app.use("/notices", noticeRoutes);
app.use('foodmenu', require('./routes/menuRoutes'))
app.use('/api', require('./routes/twilioRoutes'))

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})