const amqp = require('amqplib')
const Logger = require('logplease')
const logger = Logger.create('utils/message_broker.js')
let instance

class MessageBroker {
  async init(url) {
    this.connectionURL = url
    this.connection = await amqp.connect(this.connectionURL)
    this.connection.on('error', this.connectionErrorHandle)
    this.channel = await this.connection.createChannel()
    return this
  }

  async pushToRabbitQueue(queueName, data) {
    if (!this.connection) {
      await this.init()
    }
    await this.channel.assertQueue(queueName, { durable: true }, (error) => {
      this.connectionErrorHandle(error)
    })
    return this.channel.sendToQueue(queueName, Buffer.from(data))
  }

  async listenToRabbitQueue(queueName, callback) {
    if (!this.connection) {
      await this.init()
    }
    await this.channel.assertQueue(queueName, { durable: true })
    this.channel.consume(queueName, callback, { noAck: true })
  }

  connectionErrorHandle(error) {
    logger.error(error)
  }
}

MessageBroker.getInstance = async function (url) {
  if (!instance) {
    const broker = new MessageBroker()
    instance = broker.init(url)
  }
  return instance
}

module.exports = MessageBroker
