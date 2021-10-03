const query = require('../../sql/queries/event')
const db_helper = require('../../utils/db_helper')

const create_event = async (payload, result) => {
  try {
    const res = await db_helper.update(query.create_event(payload), payload)
    if (!res.insertId) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    console.log(error);
    return result.status(400).end()
  }
}

const get_event = async (uuid, result) => {
  try {
    const event_details = await db_helper.get(query.get_event_by_uuid(uuid))
    if (!event_details.length) {
      return result.status(404).end()
    }
    return result.status(200).send(event_details[0])
  } catch (error) {
    console.log(error)
    return result.status(404).end()
  }
}
const get_events = async (result) => {
  try {
    const event_details = await db_helper.get(query.get_events())
    if (!event_details) {
      return result.status(404).end()
    }
    return result.status(200).send(event_details)
  } catch (error) {
    return result.status(404).end()
  }
}

const update_event = async (payload, uuid, result) => {
  try {
    const res = await db_helper.update(query.update_event(payload, uuid), payload)
    if (!res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(400).end()
  }
}

const delete_event = async (uuid, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_event(uuid))
    if (err || !res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(404).end()
  }
}

module.exports = {
  create_event,
  get_event,
  get_events,
  update_event,
  delete_event,
}
