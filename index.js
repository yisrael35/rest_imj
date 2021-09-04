const express = require('express')
const cors = require('cors')
const path = require('path')
const server = express()
server.use(express.json())
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const authRoutes = require('./api/auth/auth.routes')


server.use(cors())

// Routes
server.use('/auth', authRoutes)

const port = process.env.APP_PORT || 3000
server.listen(port, () => {
  console.log('Server is running on:', port)
})

