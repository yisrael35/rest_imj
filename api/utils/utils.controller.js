const Logger = require('logplease')
const logger = Logger.create('event.controller.js')
const utils_service = require('./utils.service')



const get_utils = async (req, res) => {
  try {
    utils_service.get_utils(res)
  } catch (error) {
    return res.status(400).end()
  }
}

module.exports = {
  get_utils
}
