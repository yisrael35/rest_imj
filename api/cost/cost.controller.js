const Logger = require('logplease')
const logger = Logger.create('cost.controller.js')
const cost_service = require('./cost.service')
const query = require('../../sql/queries/cost')
const db_helper = require('../../utils/db_helper')

const create_cost = async (req, res) => {
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
    cost_service.create_cost(body_parameters, { bid_id, event_id }, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_cost = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    cost_service.get_cost(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const get_costs = async (req, res) => {
  try {
    cost_service.get_costs(res)
  } catch (error) {
    return res.status(400).end()
  }
}
const update_cost = async (req, res) => {
  try {
    const uuid = req.params.id
    const body_parameters = await process_payload_update(req.body)
    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    cost_service.update_cost(body_parameters, uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const delete_cost = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    cost_service.delete_cost(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const process_payload_create = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res_cost = []
      for (const payload of data.costs) {
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
      logger.error(`Failed to process create cost payload, The error: ${error}`)
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
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process update cost payload, The error: ${error}`)
      return reject({ status: 400 })
    }
  })
}

module.exports = {
  create_cost,
  get_cost,
  get_costs,
  update_cost,
  delete_cost,
}
