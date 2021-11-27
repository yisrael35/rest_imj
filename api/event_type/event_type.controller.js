const Logger = require('logplease')
const logger = Logger.create('event_type.controller.js')
const event_type_service = require('./event_type.service')

const create_event_type = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    if (!body_parameters) {
      return res.status(400).end()
    }
    event_type_service.create_event_type(body_parameters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_event_type = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    event_type_service.get_event_type(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const get_event_types = async (req, res) => {
  try {
    event_type_service.get_event_types(res)
  } catch (error) {
    return res.status(400).end()
  }
}
const update_event_type = async (req, res) => {
  try {
    const uuid = req.params.id
    const body_parameters = await process_payload(req.body)
    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    event_type_service.update_event_type(body_parameters, uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const delete_event_type = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    event_type_service.delete_event_type(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}

function process_payload(payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'name':
              processed_payload.name = val.trim()
              break
            case 'language':
              processed_payload.language = val.trim()
              break
            case 'content':
              processed_payload.content = JSON.stringify(val)
              break
            case 'fields':
              processed_payload.fields = JSON.stringify(val)
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process event_type payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  create_event_type,
  get_event_type,
  get_event_types,
  update_event_type,
  delete_event_type,
  process_payload,
}
