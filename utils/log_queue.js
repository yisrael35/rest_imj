const Logger = require('logplease')
const logger = Logger.create('./utils/services/log_queue.js')
const message_broker = require('./message_broker')

const QUEUE_URL = process.env.RABBITMQ_URL
const CHANNEL_NAME = process.env.RABBITMQ_CHANNEL_NAME
let instance

const init_queue = async () => {
  try {
    if (!instance) {
      instance = await message_broker.getInstance(QUEUE_URL)
      logger.log(`connect to queue: log successfully`)
    }
  } catch (error) {
    logger.error(`failed to init log queue, error: ${error}`)
  }
}

const send_message_to_queue = async (data) => {
  try {
    if (!instance) {
      await init_queue()
    }
    instance.pushToRabbitQueue(CHANNEL_NAME, JSON.stringify(data))
  } catch (error) {
    logger.error(`failed to send message in log queue, error: ${error}`)
  }
}
module.exports = { send_message_to_queue, init_queue }
