const query = require('../../sql/queries/utils')
const db_helper = require('../../utils/db_helper')

const get_utils = async (result) => {
  try {
    const data = {}
    data['locations'] = await db_helper.get(query.get_locations())
    data['event_type'] = await db_helper.get(query.get_event_type())
    return result.status(200).send(data)
  } catch (error) {
    return result.status(500).end()
  }
}

module.exports = {
  get_utils,
}
