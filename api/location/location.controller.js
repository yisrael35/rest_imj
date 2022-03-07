const Logger = require('logplease')
const logger = Logger.create('location.controller.js')
const location_service = require('./location.service')

const create_location = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    if (!body_parameters) {
      return res.status(400).end()
    }
    location_service.create_location(body_parameters, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}

const get_location = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    location_service.get_location(uuid, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}
const get_locations = async (req, res) => {
  try {
    location_service.get_locations(res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}
const update_location = async (req, res) => {
  try {
    const uuid = req.params.id
    const body_parameters = await process_payload(req.body)
    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    location_service.update_location(body_parameters, uuid, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}
const delete_location = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    location_service.delete_location(uuid, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}

const process_payload = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'name_en':
              processed_payload.name_en = val.trim()
              break
            case 'name_he':
              processed_payload.name_he = val.trim()
              break
            case 'mapping':
              processed_payload.mapping = val.trim()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process location payload, The error: ${error}`)
      return reject({ status: 400 })
    }
  })
}

module.exports = {
  create_location,
  get_location,
  get_locations,
  update_location,
  delete_location,
}
