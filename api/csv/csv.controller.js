const Logger = require('logplease')
const logger = Logger.create('csv.controller.js')
const csv_service = require('./csv.service')

const create_csv = async (req, res) => {
  try {
    const process_data = await process_payload(req.query)
    if (!process_data.table) {
      return res.status(400).end('Field "table" is missing from body')
    }
    csv_service.create_csv(process_data, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const delete_csv = async (req, res) => {
  try {
    const file_name = req.params.id
    if (!file_name) {
      return res.status(400).end()
    }
    csv_service.delete_csv(file_name, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const process_payload = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tables = ['user', 'client', 'bid', 'cost', 'event', 'supplier', 'event_type', 'location', 'schedule_event']
      const processed_payload = { filters: {} }
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'table':
              if (!tables.includes(val.trim())) {
                return reject({ status: 400 })
              }
              processed_payload.table = val.trim()
              break
            case 'from_date':
              processed_payload.filters.from_date = val
              break
            case 'to_date':
              processed_payload.filters.to_date = val
              break
            default:
              return reject({ status: 400 })
          }
        }
      }

      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process csv payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  create_csv,
  delete_csv,
}
