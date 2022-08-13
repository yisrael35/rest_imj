const Logger = require('logplease')
const logger = Logger.create('./utils/send_sms.js')
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)
const { check_phone } = require('./helper')

/**
 * Send sms - function that send a message via sms.
 * @param {string} phone_number The phone number that you want to send to.
 * @param {string} message The message that you want this number will get.
 * @return {Promise<Object>} object that contain status like (200,400,500), example: { status: 200 }.
 */
const send_sms = async (phone_number, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!check_phone(phone_number)) {
        return reject({ status: 400 })
      }
      client.messages
        .create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone_number,
        })
        .then((message) => {
          return resolve({
            status: 200,
          })
        })
        .catch((error) => {
          logger.error(`Failed to send sms, error: ${error}`)
          return reject({
            status: error.status,
          })
        })
    } catch (error) {
      logger.error(`Failed to send sms, error: ${error}`)
      if (error.status) {
        return reject({ status: 400 })
      }
      return reject({
        status: 500,
        message: `Server error: ${error.message}`,
      })
    }
  })
}

module.exports = { send_sms }

// process payload to query string
const process_payload = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined || typeof val !== 'object') {
          switch (key) {
            case config_process.send_sms.phone:
              const dialing_code = val[config_process.send_sms.dialing_code].trim()
              const number = val[config_process.send_sms.number].trim()

              if (dialing_code && number) {
                processed_payload.phone = '+' + dialing_code + number
              } else {
                return reject({ status: 400 })
              }
              break
            case config_process.send_sms.message:
              processed_payload.message = val.toUpperCase().trim()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process payload, The error: ${error}`)
      return reject({ status: 400 })
    }
  })
}
