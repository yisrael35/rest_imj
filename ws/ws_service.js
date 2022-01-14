const moment = require('moment')
const { v1: uuid } = require('uuid')
const WebSocket = require('ws')
const { createServer } = require('http')
const session_manager = require('./helpers/session_manager')
const auth_manager = require('./helpers/auth_manager')
const Logger = require('logplease')
const logger = Logger.create('ws/ws_service.js')
const server = createServer()

const wss = new WebSocket.Server({ server })
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

  setInterval(() => {
    ws.send(JSON.stringify(message_builder({ type: 'test', error: false, content: `hello world`, code: '200' })))
  }, 3000)

  ws.on('message', function incoming(message) {
    logger.log('---------------------------------------')
    const session = session_manager.get_session(ws.id)
    if (!session || !session.authenticate) {
      ws.send(JSON.stringify(message_builder({ type: 'login', error: true, content: 'Unauthorized', code: '401' })))
      return
    }
    logger.log(JSON.parse(message))
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
  logger.log(new_session)
  session_manager.add_session(ws.id, new_session)
  ws.send(JSON.stringify(message_builder({ type: 'login', error: false, content: `success`, code: '200' })))
}

const message_builder = ({ type, error, content, code }) => {
  return {
    type,
    error,
    content,
    code,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
  }
}
