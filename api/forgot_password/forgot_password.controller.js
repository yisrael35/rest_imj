// process data, when data is processed, call function inside service(different file).
const Logger = require('logplease')
const logger = Logger.create('forgot_password.controller.js')
const forgot_password_service = require('./forgot_password.service')
const Hashes = require('jshashes')
const SHA256 = new Hashes.SHA256()
const { check_password } = require('../../utils/helper')

const forgot_password = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    forgot_password_service.forgot_password(body_parameters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const change_password = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    if (!body_parameters.password) {
      return res.status(400).end()
    }
    const user_id = req.headers.bearerAuth.user.id
    forgot_password_service.change_password(body_parameters, user_id, res)
  } catch (error) {
    return res.status(400).end()
  }
}

// process login payload (req)
function process_payload(payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'username':
              processed_payload.username = val.trim()
              break
            case 'password':
              // const is_valid_psw = check_password(val)
              // if (!is_valid_psw) {
              //   return reject({ status: 400 })
              // }
              processed_payload.password = SHA256.hex(val.trim())
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  forgot_password,
  change_password,
}
