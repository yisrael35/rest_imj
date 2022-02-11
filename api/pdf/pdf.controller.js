const Logger = require('logplease')
const logger = Logger.create('pdf.controller.js')
const pdf_service = require('./pdf.service')
const query = require('../../sql/queries/pdf')
const db_helper = require('../../utils/db_helper')
const { validateEmail } = require('../../utils/helper')

const create_pdf = async (req, res) => {
  try {
    const process_data = await process_payload(req.body)
    const { bid_id, event_id, email } = process_data
    let event_type_id, fields
    if (bid_id) {
      const [res_bid] = await db_helper.get(query.get_bid_id_by_uuid(bid_id))
      if (!res_bid) {
        return res.status(404).end()
      }
      event_type_id = res_bid.event_type_id
      fields = await get_fields(event_type_id, res_bid)
    }
    if (event_id) {
      const [res_event] = await db_helper.get(query.get_event_id_by_uuid(event_id))
      if (!res_event) {
        return res.status(404).end()
      }
      event_type_id = res_event.event_type_id
      fields = await get_fields(event_id, res_event)
    }
    pdf_service.create_pdf({ event_type_id, fields, email }, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const delete_pdf = async (req, res) => {
  try {
    const file_name = req.params.id
    if (!file_name) {
      return res.status(400).end()
    }
    pdf_service.delete_pdf(file_name, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_fields = async (event_type_id, unprocessed_data) => {
  const [res_event_type] = await db_helper.get(query.get_event_type(event_type_id))
  if (!res_event_type) {
    logger.error('res_event_type failed')
    throw Error
  }
  let fields = JSON.parse(res_event_type['fields'])
  const process_data = {}
  for (const [key, val] of Object.entries(fields)) {
    // TODO : hanle multiple tables

    process_data[key] = unprocessed_data[key]
  }
  return process_data
}

const process_payload = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'bid_id':
              processed_payload.bid_id = val.trim()
              break
            case 'event_id':
              processed_payload.event_id = val.trim()
              break
            case 'email':
              if (!validateEmail(val)) {
                return reject({ status: 400 })
              }
              processed_payload.email = val.trim()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process pdf payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  create_pdf,
  delete_pdf,
}
