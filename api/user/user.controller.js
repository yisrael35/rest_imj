const Logger = require('logplease')
const logger = Logger.create('user.controller.js')
const user_service = require('./user.service')
const Hashes = require('jshashes')
const SHA256 = new Hashes.SHA256()

const create_user = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    if (!body_parameters.username || !body_parameters.name || !body_parameters.level || !body_parameters.password || !body_parameters.email) {
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
    user_service.get_user(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const get_users = async (req, res) => {
  try {
    
    user_service.get_users( res)
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
    user_service.update_user(body_parameters, uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const delete_user = async (req, res) => {
  try {
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
  create_user,
  get_user,
  get_users,
  update_user,
  delete_user,
}
