const Logger = require('logplease')
const logger = Logger.create('event.controller.js')
const event_service = require('./event.service')

const create_event = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    if (!body_parameters) {
      return res.status(400).end()
    }
    event_service.create_event(body_parameters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_event = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    event_service.get_event(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const get_events = async (req, res) => {
  try {
    event_service.get_events(res)
  } catch (error) {
    return res.status(400).end()
  }
}
const update_event = async (req, res) => {
  try {
    const uuid = req.params.id
    const body_parameters = await process_payload(req.body)
    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    event_service.update_event(body_parameters, uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const delete_event = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    event_service.delete_event(uuid, res)
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
            case 'eventcol':
              processed_payload.eventcol = val.trim()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process event payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  create_event,
  get_event,
  get_events,
  update_event,
  delete_event,
}
