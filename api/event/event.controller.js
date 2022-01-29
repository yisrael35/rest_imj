const Logger = require('logplease')
const logger = Logger.create('event.controller.js')
const event_service = require('./event.service')
const db_helper = require('../../utils/db_helper')
const query = require('../../sql/queries/event')
const helper = require('../../utils/helper')
const moment = require('moment')

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
    const filters = await helper.process_filters(req.query)

    event_service.get_events(filters, res)
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

const process_payload = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'name':
              processed_payload.name = val.trim()
              break
            case 'user':
              let user_uuid = val
              let [res_user] = await db_helper.get(query.get_user_by_uuid(user_uuid))
              if (!res_user) {
                return reject({ status: 404 })
              }
              processed_payload.user_id = Number(res_user.id)
              break
            case 'from_date':
              processed_payload.from_date = moment(val).format('YYYY-MM-DD HH:mm:ss')
              break
            case 'to_date':
              processed_payload.to_date = moment(val).format('YYYY-MM-DD HH:mm:ss')
              break
            case 'status':
              if (val !== 'pending' && val !== 'approved' && val !== 'canceled ') {
                return reject({ status: 400 })
              }
              processed_payload.status = val.trim()
              break
            case 'clients':
              let res_clients = await db_helper.get(query.get_clients_by_uuids(val))
              if (!res_clients) {
                return reject({ status: 404 })
              }
              const clients = []
              for (const client of res_clients) {
                clients.push(client.id)
              }
              processed_payload.clients = JSON.stringify(clients)
              break
            case 'type':
              if (val !== 'public' && val !== 'private' && val !== 'inside' && val !== 'photo_shot') {
                return reject({ status: 400 })
              }
              processed_payload.type = val.trim()
              break
            case 'comment':
              processed_payload.comment = val.trim()
              break
            case 'budget':
              processed_payload.budget = val
              break
            case 'check_list':
              processed_payload.check_list = val
              break
            case 'suppliers':
              let res_suppliers = await db_helper.get(query.get_suppliers_by_uuids(val))
              if (!res_suppliers) {
                return reject({ status: 404 })
              }
              const suppliers = []
              for (const client of res_suppliers) {
                suppliers.push(client.id)
              }
              processed_payload.suppliers = JSON.stringify(suppliers)
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
