const { v1: uuid } = require('uuid')
const WebSocket = require('ws')
const { createServer } = require('http')
const session_manager = require('../helpers/session_manager')
const auth_manager = require('../helpers/auth_manager')
const { message_type } = require('../helpers/message_handler')
const { message_builder } = require('../helpers/message_builder')
const { get_events } = require('../models/event')
const Logger = require('logplease')
const logger = Logger.create('./ws/ws_service.js')
const server = createServer()

const wss = new WebSocket.Server({ server })
const get_wss_of_ws_service = () => wss

wss.on('connection', async (ws, req) => {
  ws.id = uuid()
  logger.log(`WS - New connection detected: ${ws.id}`)
  try {
    let token = req.url.split('/?token=')[1]
    if (token) {
      await handle_token(token, ws)
    } else {
      ws.send(JSON.stringify(message_builder({ type: 'login', error: true, content: `couldn't find the token`, code: '401' })))
      return
    }
  } catch (error) {
    logger.log(`Error login:  ${error}`)
    ws.send(JSON.stringify(message_builder({ type: 'login', error: true, content: error, code: '401' })))
    return
  }

  ws.on('message', (message) => {
    try {
      const session = session_manager.get_session(ws.id)
      if (!session || !session.authenticate) {
        ws.send(JSON.stringify(message_builder({ type: 'login', error: true, content: 'Unauthorized', code: '401' })))
        return
      }
      message = JSON.parse(message)
      message_type(message, ws)
    } catch (error) {
      logger.error(error)
      return ws.send(JSON.stringify(message_builder({ type: 'message', error: true, content: message, code: '400' })))
    }
  })
  ws.on('pong', () => heartbeat(ws))
  ws.on('error', async () => {
    ws.close()
  })

  ws.on('close', async () => {
    logger.log(`Closing session [${ws.id}]`)
    session_manager.delete_session(ws.id)
    ws.terminate()
  })
})
wss.on('close', () => clearInterval(interval))

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.close()
    }

    ws.isAlive = false
    ws.ping()
  })
}, 30000)

const heartbeat = (ws) => {
  ws.isAlive = true
}

server.listen(process.env.WS_PORT)
logger.log('WS Server is running on:', process.env.WS_PORT)

const handle_token = async (token, ws) => {
  login_data = await auth_manager.checkJWT(token)
  const new_session = {
    ...login_data,
    authenticate: true,
  }
  session_manager.add_session(ws.id, new_session)
  ws.send(JSON.stringify(message_builder({ type: 'login', error: false, content: `login success`, code: '200' })))
  get_events({}, ws)
}

exports.get_wss_of_ws_service = get_wss_of_ws_service
