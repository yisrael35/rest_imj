const Logger = require('logplease')
const logger = Logger.create('schedule_event.controller.js')
const schedule_event_service = require('./schedule_event.service')
const query = require('../../sql/queries/schedule_event')
const db_helper = require('../../utils/db_helper')

const create_schedule_event = async (req, res) => {
  try {
    const bid_uuid = req.body.bid_id
    const event_uuid = req.body.event_id
    let bid_id
    let event_id
    if (bid_uuid) {
      const [res_bid] = await db_helper.get(query.get_bid_id_by_uuid(bid_uuid))
      if (!res_bid) {
        return res.status(404).end()
      }
      bid_id = res_bid.bid_id
    }
    if (event_uuid) {
      const [res_event] = await db_helper.get(query.get_event_id_by_uuid(event_uuid))
      if (!res_event) {
        return res.status(404).end()
      }
      event_id = res_event.event_id
    }
    const body_parameters = await process_payload_create(req.body)
    if (!body_parameters) {
      return res.status(400).end()
    }
    schedule_event_service.create_schedule_event(body_parameters, { bid_id, event_id }, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_schedule_event = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    schedule_event_service.get_schedule_event(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const get_schedule_events = async (req, res) => {
  try {
    schedule_event_service.get_schedule_events(res)
  } catch (error) {
    return res.status(400).end()
  }
}
const update_schedule_event = async (req, res) => {
  try {
    const uuid = req.params.id
    const body_parameters = await process_payload_update(req.body)
    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    schedule_event_service.update_schedule_event(body_parameters, uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const delete_schedule_event = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    schedule_event_service.delete_schedule_event(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const process_payload_create = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res_schedule_event = []
      for (const payload of data.schedule_event) {
        const processed_payload = {}
        for (const [key, val] of Object.entries(payload)) {
          if (val !== undefined) {
            switch (key) {
              case 'start_time':
                processed_payload.start_activity = val.trim()
                break
              case 'end_time':
                processed_payload.end_activity = val.trim()
                break
              case 'activity_description':
                processed_payload.description = val.trim()
                break
              default:
                return reject({ status: 400 })
            }
          }
        }
        res_schedule_event.push(processed_payload)
      }
      return resolve(res_schedule_event)
    } catch (error) {
      logger.error(`Failed to process create schedule_event payload, The error: ${error}`)
      return reject({ status: 400 })
    }
  })
}

const process_payload_update = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'start_time':
              processed_payload.start_activity = val.trim()
              break
            case 'end_time':
              processed_payload.end_activity = val.trim()
              break
            case 'activity_description':
              processed_payload.description = val.trim()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process update schedule_event payload, The error: ${error}`)
      return reject({ status: 400 })
    }
  })
}

module.exports = {
  create_schedule_event,
  get_schedule_event,
  get_schedule_events,
  update_schedule_event,
  delete_schedule_event,
}
