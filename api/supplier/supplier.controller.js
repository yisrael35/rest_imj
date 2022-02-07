const Logger = require('logplease')
const logger = Logger.create('event.controller.js')
const supplier_service = require('./supplier.service')
const helper = require('../../utils/helper')

const create_supplier = async (req, res) => {
  try {
    const body_parameters = await process_payload(req.body)
    if (!body_parameters) {
      return res.status(400).end()
    }
    supplier_service.create_supplier(body_parameters, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_supplier = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    supplier_service.get_supplier(uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const get_suppliers = async (req, res) => {
  try {
    const filters = await helper.process_filters(req.query)
    supplier_service.get_suppliers(filters, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const update_supplier = async (req, res) => {
  try {
    const uuid = req.params.id
    const body_parameters = await process_payload(req.body)
    if (!uuid || !body_parameters) {
      return res.status(400).end()
    }
    supplier_service.update_supplier(body_parameters, uuid, res)
  } catch (error) {
    return res.status(400).end()
  }
}
const delete_supplier = async (req, res) => {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return res.status(400).end()
    }
    supplier_service.delete_supplier(uuid, res)
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
            case 'account':
              processed_payload.account = JSON.stringify(val)
              break
            case 'email':
              processed_payload.email =  val.trim()
              break
            case 'phone':
              processed_payload.phone =  val.trim()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process supplier payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  create_supplier,
  get_supplier,
  get_suppliers,
  update_supplier,
  delete_supplier,
}
