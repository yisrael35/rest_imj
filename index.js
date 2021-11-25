const express = require('express')
const cors = require('cors')
const path = require('path')
const server = express()
server.use(express.json())
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

server.use(cors('*'))

// Files of the Routes
const auth_routes = require('./api/auth/auth.routes')
const user_routes = require('./api/user/user.routes')
const forgot_password_routes = require('./api/forgot_password/forgot_password.routes')
const event_routes = require('./api/event/event.routes')
const event_type_routes = require('./api/event_type/event_type.routes')
const client_routes = require('./api/client/client.routes')
const bid_routes = require('./api/bid/bid.routes')
const location_routes = require('./api/location/location.routes')
const utils_routes = require('./api/utils/utils.routes')
const cost_routes = require('./api/cost/cost.routes')
const schedule_event_routes = require('./api/schedule_event/schedule_event.routes')

// Routes
server.use('/auth', auth_routes)
server.use('/user', user_routes)
server.use('/forgot_password', forgot_password_routes)
server.use('/event', event_routes)
server.use('/event_type', event_type_routes)
server.use('/client', client_routes)
server.use('/bid', bid_routes)
server.use('/location', location_routes)
server.use('/utils', utils_routes)
server.use('/cost', cost_routes)
server.use('/schedule_event', schedule_event_routes)

const port = process.env.APP_PORT || 3001
server.listen(port, () => {
  console.log('Server is running on:', port)
})
