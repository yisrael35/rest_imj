const Logger = require('logplease')
const logger = Logger.create('user.controller.js')
const user_service = require('./user.service')
const Hashes = require('jshashes')
const SHA256 = new Hashes.SHA256()
const helper = require('../../utils/helper')
const create_user = async (req, res) => {
  try {
    //validte - admin only
    let level = req.headers.bearerAuth.user.level
    if (level !== 1) {
      return res.status(403).end()
    }
    const body_parameters = await process_payload(req.body)
    if (!body_parameters.username || !body_parameters.first_name || !body_parameters.last_name || !body_parameters.email || !body_parameters.password) {
      return res.status(400).end()
    }
    user_service.create_user(body_parameters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_user = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    user_service.get_user(uuid, req, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_users = async (req, res) => {
  try {
    //validte - admin only
    const filters = await helper.process_filters(req.query)
    let level = req.headers.bearerAuth.user.level
    if (level !== 1) {
      return res.status(403).end()
    }
    user_service.get_users(filters, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const update_user = async (req, res) => {
  try {
    const uuid = req.params.id
    const body_parameters = await process_payload(req.body)
    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    user_service.update_user(body_parameters, uuid, req, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const delete_user = async (req, res) => {
  try {
    //validte - admin only
    let level = req.headers.bearerAuth.user.level
    if (level !== 1) {
      return res.status(403).end()
    }
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    user_service.delete_user(uuid, res)
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
              processed_payload.email = val.trim()
              break
            case 'phone':
              processed_payload.phone = val
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process user payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  create_user,
  get_user,
  get_users,
  update_user,
  delete_user,
}
