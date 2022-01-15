const Logger = require('logplease')
const logger = Logger.create('event.controller.js')
const client_service = require('./client.service')
const helper = require('../../utils/helper')

const create_client = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    if (!body_parameters) {
      return res.status(400).end()
    }
    client_service.create_client(body_parameters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_client = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    client_service.get_client(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const get_clients = async (req, res) => {
  try {
    const filters = await helper.process_filters(req.query)
    client_service.get_clients(filters, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const update_client = async (req, res) => {
  try {
    const uuid = req.params.id
    const body_parameters = await process_payload(req.body)
    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    client_service.update_client(body_parameters, uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const delete_client = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    client_service.delete_client(uuid, res)
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
            case 'type':
              processed_payload.type = val.trim()
              break
            case 'contact':
              processed_payload.contact = JSON.stringify(val)
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process client payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  create_client,
  get_client,
  get_clients,
  update_client,
  delete_client,
}
