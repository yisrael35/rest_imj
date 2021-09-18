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
    // logger.log('login: ', body_parameters)
    auth_service.sign_in(body_parameters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

//register
const sign_up = async (req, res) => {
  try {
    // TODO - only admin
    // let level = req.headers.bearerAuth.user.level
    // if (level !== 1) {
    //   return res.status(403).end()
    // }
    const body_parameters = await process_payload(req.body)
    if (!body_parameters.username || !body_parameters.password) {
      return res.status(400).end()
    }
    auth_service.sign_up(body_parameters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const sign_out = async (req, res) => {
  try {
    const header_parameters = req.headers
    auth_service.sign_out(header_parameters, res)
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
              processed_payload.password = SHA256.hex(val.trim())
              break
            case 'name':
              processed_payload.name = val.trim()
              break
            case 'level':
              processed_payload.level = val
              break
            case 'email':
              processed_payload.level = val
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
  sign_in,
  sign_out,
  sign_up,
}
