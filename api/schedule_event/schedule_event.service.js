const query = require('../../sql/queries/schedule_event')
const db_helper = require('../../utils/db_helper')
const Logger = require('logplease')
const logger = Logger.create('schedule_event.service.js')

const create_schedule_event = async (schedule_events, { bid_id, event_id }, result) => {
  try {
    for (const schedule_event of schedule_events) {
      schedule_event.bid_id = bid_id
      schedule_event.event_id = event_id
      const res_schedule_events = await db_helper.update(query.create_schedule_event(schedule_event), schedule_event)
      if (!res_schedule_events.affectedRows) {
        logger.error('res_schedule_events -- error')
        return result.status(400).end()
      }
    }
    return result.status(200).end()
  } catch (error) {
    logger.log(error)
    return result.status(400).end()
  }
}

const get_schedule_event = async (uuid, result) => {
  try {
    const schedule_event_details = await db_helper.get(query.get_schedule_event_by_uuid(uuid))
    if (!schedule_event_details.length) {
      return result.status(404).end()
    }
    return result.status(200).send(schedule_event_details[0])
  } catch (error) {
    logger.log(error)
    return result.status(404).end()
  }
}
const get_schedule_events = async (result) => {
  try {
    const schedule_event_details = await db_helper.get(query.get_schedule_events())
    if (!schedule_event_details) {
      return result.status(404).end()
    }
    return result.status(200).send(schedule_event_details)
  } catch (error) {
    return result.status(404).end()
  }
}

const update_schedule_event = async (payload, uuid, result) => {
  try {
    const res = await db_helper.update(query.update_schedule_event(payload, uuid), payload)
    if (!res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(400).end()
  }
}

const delete_schedule_event = async (uuid, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_schedule_event(uuid))
    if (err || !res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(404).end()
  }
}

module.exports = {
  create_schedule_event,
  get_schedule_event,
  get_schedule_events,
  update_schedule_event,
  delete_schedule_event,
}
