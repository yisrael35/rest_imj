const Logger = require('logplease')
const { send_message_to_queue } = require('./log_queue')

const log = async (message, location) => {
  const logger = Logger.create(location)
  logger.log(message)

  if (process.env.QUEUE_LOGGER_ACTIVATE === 'true') {
    const log_data = { type: 'log', file: location, message, date: new Date() }
    send_message_to_queue(log_data, logger)
  }
}

const error = async (message, location) => {
  const logger = Logger.create(location)
  logger.error(message)

  if (process.env.QUEUE_LOGGER_ACTIVATE === 'true') {
    const log_data = { type: 'error', file: location, message, date: new Date() }
    send_message_to_queue(log_data)
  }
}

const info = async (message, location) => {
  const logger = Logger.create(location)
  logger.info(message)

  if (process.env.QUEUE_LOGGER_ACTIVATE === 'true') {
    const log_data = { type: 'info', file: location, message, date: new Date() }
    send_message_to_queue(log_data)
  }
}

exports.log = log
exports.error = error
exports.info = info
