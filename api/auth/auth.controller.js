// process data, when data is processed, call function inside service(different file).
const Logger = require('logplease')
const logger = Logger.create('auth.controller.js')
const auth_service = require('./auth.service')
const Hashes = require('jshashes')
const SHA256 = new Hashes.SHA256()

//login
const sign_in = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    auth_service.sign_in(body_parameters, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}

//register
const sign_up = async (req, res) => {
  try {
    //  only admin
    let level = req.headers.bearerAuth.user.level
    if (level !== 1) {
      return res.status(403).end()
    }
    const body_parameters = await process_payload(req.body)
    if (!body_parameters.username || !body_parameters.password) {
      return res.status(400).end()
    }
    auth_service.sign_up(body_parameters, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}

const sign_out = async (req, res) => {
  try {
    const header_parameters = req.headers
    auth_service.sign_out(header_parameters, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}

const send_six_digits = async (req, res) => {
  try {
    const { user, type, token } = req.headers.bearerAuth
    const { id: user_id } = user
    if (type !== 'login') {
      return res.status(403).end()
    }
    const body_parameters = await process_payload(req.body)
    if (!body_parameters.send_code_to) {
      return res.status(400).send('Field send_code_to is missing')
    }
    body_parameters.user_id = user_id
    body_parameters.type = type
    body_parameters.token = token
    auth_service.send_six_digits(body_parameters, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}
const validate_six_digits = async (req, res) => {
  try {
    const { user, type, token } = req.headers.bearerAuth
    const { id: user_id } = user
    if (type !== 'login') {
      return res.status(403).end()
    }
    const body_parameters = await process_payload(req.body)
    if (!body_parameters.code) {
      return res.status(400).send('Field code is missing')
    }
    body_parameters.user_id = user_id
    body_parameters.type = type
    body_parameters.token = token
    auth_service.validate_six_digits(body_parameters, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}
const update_two_fa_status = async (req, res) => {
  try {
    //  only admin
    let level = req.headers.bearerAuth.user.level
    if (level !== 1) {
      return res.status(403).end()
    }
    const body_parameters = await process_payload(req.body)
    if (!body_parameters.two_fa_status) {
      return res.status(400).send('Field two_fa_status is missing')
    }
    auth_service.update_two_fa_status(body_parameters, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}

// process login payload (req)
const process_payload = (payload) => {
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
              processed_payload.password = SHA256.hex(val.trim())
              break
            case 'first_name':
              processed_payload.first_name = val.trim()
              break
            case 'last_name':
              processed_payload.last_name = val.trim()
              break
            case 'level':
              processed_payload.level = val
              break
            case 'email':
              processed_payload.email = val
              break
            case 'code':
              processed_payload.code = val
              break
            case 'send_code_to':
              if (val !== 'sms' && val !== 'email') {
                return reject({ status: 400, message: 'send_code_to should be sms or email' })
              }
              processed_payload.send_code_to = val
              break
            case 'two_fa_status':
              if (val !== 'true' && val !== true && val !== 'false' && val !== false) {
                return reject({ status: 400 })
              }
              processed_payload.two_fa_status = val.toString()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process auth payload, The error: ${error}`)
      return reject({ status: 400 })
    }
  })
}

module.exports = {
  sign_in,
  sign_out,
  sign_up,
  send_six_digits,
  validate_six_digits,
  update_two_fa_status,
}
