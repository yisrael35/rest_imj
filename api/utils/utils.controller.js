const Logger = require('logplease')
const logger = Logger.create('event.controller.js')
const utils_service = require('./utils.service')

const get_utils = async (req, res) => {
  try {
    let level = req.headers.bearerAuth.user.level
    utils_service.get_utils(res, level)
  } catch (error) {
    logger.error(error)
    return res.status(400).end()
  }
}

module.exports = {
  get_utils,
}
