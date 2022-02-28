const Logger = require('logplease')
const logger = Logger.create('event.controller.js')
const bid_service = require('./bid.service')
const db_helper = require('../../utils/db_helper')
const query = require('../../sql/queries/bid')
const helper = require('../../utils/helper')

const create_bid = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    if (!body_parameters) {
      return res.status(400).end()
    }
    bid_service.create_bid(body_parameters, res)
  } catch (error) {
    logger.error(error)
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
    logger.error(error)
    return res.status(400).end()
  }
}

const get_bids = async (req, res) => {
  try {
    const filters = await helper.process_filters(req.query)

    bid_service.get_bids(filters, res)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}

const update_bid = async (req, res) => {
  try {
    const uuid = req.params.id
    const body_parameters = await process_payload_bid(req.body)

    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    bid_service.update_bid(body_parameters, uuid, res)
  } catch (error) {
    logger.error(error)
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
              const [res_client] = await db_helper.get(query.get_client_by_uuid(val))
              if (!res_client) {
                return reject({ status: 404 })
              }
              processed_payload.client_id = res_client.id
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
            case 'language':
              if (val !== 'he' && val !== 'en') {
                return reject({ status: 400 })
              }
              processed_payload.language = val
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

module.exports = {
  create_bid,
  get_bid,
  get_bids,
  update_bid,
  delete_bid,
}
