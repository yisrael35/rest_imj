const event = require('../models/event')
const Logger = require('logplease')
const logger = Logger.create('./ws/helper/message_handler.js')
const { message_builder } = require('./message_builder')

const message_type = (message, ws) => {
  try {
    logger.log(message)

    if (!message || !message.type) {
      return ws.send(JSON.stringify(message_builder({ type: 'message_type', error: true, content: message, code: '400' })))
    }
    switch (message.type) {
      case 'init-connection':
        break
      case 'get_events':
        event.get_events(message, ws)
        break
      default:
        return ws.send(JSON.stringify(message_builder({ type: 'message_type', error: true, content: message, code: '400' })))
    }
  } catch (error) {
    logger.error(error)
    return ws.send(JSON.stringify(message_builder({ type: 'message_type', error: true, content: message, code: '400' })))
  }
}

module.exports = {
  message_type,
}
