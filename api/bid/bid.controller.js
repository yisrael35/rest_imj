const Logger = require('logplease')
const logger = Logger.create('event.controller.js')
const bid_service = require('./bid.service')
const db_helper = require('../../utils/db_helper')
const query = require('../../sql/queries/bid')
const helper = require('../../utils/helper')

const create_bid = async (req, res) => {
  try {
    const main_body_parameters = await process_payload_main(req.body)
    if (!main_body_parameters.bid || !main_body_parameters.schedule_event || !main_body_parameters.costs) {
      return res.status(400).end()
    }
    const bid_body_parameters = await process_payload_bid(main_body_parameters.bid)
    const schedule_event_body_parameters = await process_payload_schedule_event(main_body_parameters.schedule_event)
    const costs_body_parameters = await process_payload_costs(main_body_parameters.costs)
    const body_parameters = { bid: bid_body_parameters, schedule_event: schedule_event_body_parameters, costs: costs_body_parameters, language: main_body_parameters.language }
    if (!body_parameters) {
      return res.status(400).end()
    }
    bid_service.create_bid(body_parameters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_bid = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    bid_service.get_bid(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_bids = async (req, res) => {
  try {
    const filters = await helper.process_filters(req.query)

    bid_service.get_bids(filters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const update_bid = async (req, res) => {
  try {
    console.log('im here 0')
    const uuid = req.params.id
    console.log(req.body)
    const body_parameters = await process_payload_bid(req.body)

    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    console.log(uuid)
    console.log(body_parameters)
    console.log('im here 1')
    bid_service.update_bid(body_parameters, uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const delete_bid = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    bid_service.delete_bid(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const process_payload_main = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'bid':
              processed_payload.bid = val
              break
            case 'schedule_event':
              processed_payload.schedule_event = val
              break
            case 'costs':
              processed_payload.costs = val
              break
            case 'language':
              processed_payload.language = val
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process main bid payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

const process_payload_bid = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'bid_num':
              processed_payload.uuid = val.trim()
              break
            case 'event_type':
              processed_payload.event_type_id = Number(val)
              break
            case 'location':
              processed_payload.location_id = Number(val)
              break
            case 'user':
              let user_uuid = val
              let [res_user] = await db_helper.get(query.get_user_by_uuid(user_uuid))
              if (!res_user) {
                return reject({ status: 404 })
              }
              processed_payload.user_id = Number(res_user.id)
              break
            case 'event_date':
              processed_payload.event_date = val.trim()
              break
            case 'client_id':
              processed_payload.client_id = Number(val)
              break
            case 'event_name':
              processed_payload.event_name = val.trim()
              break
            case 'event_comment':
              processed_payload.comment = val.trim()
              break
            case 'total_a_discount':
              processed_payload.total_a_discount = Number(val)
              break
            case 'total_b_discount':
              processed_payload.total_b_discount = Number(val)
              break
            case 'total_discount':
              processed_payload.total_discount = Number(val)
              break
            case 'currency':
              processed_payload.currency = val.trim()
              break
            case 'max_participants':
              processed_payload.max_participants = Number(val)
              break
            case 'min_participants':
              processed_payload.min_participants = Number(val)
              break
            case 'status':
              processed_payload.status = val.trim()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process bid payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

const process_payload_schedule_event = (schedule_event) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res_schedule_event = []
      for (const payload of schedule_event) {
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
      logger.error(`Failed to process schedule_event - bid payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

const process_payload_costs = (cost) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res_cost = []
      for (const payload of cost) {
        const processed_payload = {}
        for (const [key, val] of Object.entries(payload)) {
          if (val !== undefined) {
            switch (key) {
              case 'description':
                processed_payload.description = val.trim()
                break
              case 'amount':
                processed_payload.amount = Number(val)
                break
              case 'unit_cost':
                processed_payload.unit_cost = Number(val)
                break
              case 'total_cost':
                processed_payload.total_cost = Number(val)
                break
              case 'discount':
                processed_payload.discount = Number(val)
                break
              case 'comment':
                processed_payload.comment = val.trim()
                break
              default:
                return reject({ status: 400 })
            }
          }
        }
        res_cost.push(processed_payload)
      }
      return resolve(res_cost)
    } catch (error) {
      logger.error(`Failed to process cost - bid payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  create_bid,
  get_bid,
  get_bids,
  update_bid,
  delete_bid,
}
