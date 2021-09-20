const express = require('express')
const cors = require('cors')
const path = require('path')
const server = express()
server.use(express.json())
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

server.use(cors())

//files of the Routes
const auth_routes = require('./api/auth/auth.routes')
const user_routes = require('./api/user/user.routes')
const forgot_password_routes = require('./api/forgot_password/forgot_password.routes')


// Routes
server.use('/auth', auth_routes)
server.use('/user', user_routes)
server.use('/forgot_password', forgot_password_routes)

const port = process.env.APP_PORT || 3001
server.listen(port, () => {
  console.log('Server is running on:', port)
})
