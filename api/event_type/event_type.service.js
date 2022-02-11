const query = require('../../sql/queries/event_type')
const db_helper = require('../../utils/db_helper')
const Logger = require('logplease')
const logger = Logger.create('./api/event_type/event_type.service.js')

const create_event_type = async (payload, result) => {
  try {
    const res = await db_helper.update(query.create_event_type(payload), payload)
    if (!res.insertId) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(400).end()
  }
}

const get_event_type = async (id, result) => {
  try {
    const event_type_details = await db_helper.get(query.get_event_type_by_id(id))
    if (!event_type_details.length) {
      return result.status(404).end()
    }
    return result.status(200).send(event_type_details[0])
  } catch (error) {
    logger.error(error)
    return result.status(404).end()
  }
}
const get_event_types = async (result) => {
  try {
    const event_type_details = await db_helper.get(query.get_event_types())
    if (!event_type_details) {
      return result.status(404).end()
    }
    return result.status(200).send(event_type_details)
  } catch (error) {
    logger.log(error)
    return result.status(404).end()
  }
}

const update_event_type = async (payload, id, result) => {
  try {
    const res = await db_helper.update(query.update_event_type(payload, id), payload)
    if (!res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.log(error)
    return result.status(400).end()
  }
}

const delete_event_type = async (id, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_event_type(id))
    if (err || !res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.log(error)
    return result.status(404).end()
  }
}

module.exports = {
  create_event_type,
  get_event_type,
  get_event_types,
  update_event_type,
  delete_event_type,
}
