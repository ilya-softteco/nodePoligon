const express = require('express')
const PORT = 8082
const mongoose = require('mongoose')
const app = express()
const authRouter = require('./authRouter')
app.use(express.json())

app.use('/auth', authRouter)
const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27077')
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()