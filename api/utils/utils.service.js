const query = require('../../sql/queries/utils')
const db_helper = require('../../utils/db_helper')
const Logger = require('logplease')
const logger = Logger.create('./api/utils/utils.service.js')

const get_utils = async (result, level) => {
  try {
    const data = {}
    const tables = ['client', 'bid', 'cost', 'event', 'supplier', 'event_type', 'location', 'schedule_event']
    if (level === 1) {
      tables.push('user')
    }
    data['tables'] = tables
    data['clients'] = await db_helper.get(query.get_clients())
    data['locations'] = await db_helper.get(query.get_locations())
    data['event_type'] = await db_helper.get(query.get_event_type())
    return result.status(200).send(data)
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
  }
}

module.exports = {
  get_utils,
}
