const query = require('../../sql/queries/event')
const db_helper = require('../../utils/db_helper')
const Logger = require('logplease')
const logger = Logger.create('event.service.js')
const event = require('../../ws/models/event')
const csv_generator = require('../../workers/csv_worker')

const create_event = async (payload, result) => {
  try {
    const res = await db_helper.update(query.create_event(payload), payload)
    if (!res.insertId) {
      return result.status(404).end()
    }
    event.send_update_event_to_all()
    return result.status(200).end()
  } catch (error) {
    logger.log(error)
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
    logger.log(error)
    return result.status(404).end()
  }
}
const get_events = async (filters, result) => {
  try {
    const event_details = await db_helper.get(query.get_events(filters))
    if (!event_details) {
      return result.status(404).end()
    }
    if (filters.csv && filters.csv === 'true') {
      const res_csv = await csv_generator.create_csv_file(event_details)
      if (res_csv.status === 200) {
        const file_name = res_csv.file_name
        return result.status(200).send({ file_name })
      } else {
        return result.status(res_csv.status).send('failed to create csv')
      }
    }
    const meta_data = await get_meta_data(filters)

    return result.status(200).send({ events: event_details, meta_data })
  } catch (error) {
    logger.log(error)
    return result.status(404).end()
  }
}

const update_event = async (payload, uuid, result) => {
  try {
    const res = await db_helper.update(query.update_event(payload, uuid), payload)
    if (!res.affectedRows) {
      return result.status(404).end()
    }
    event.send_update_event_to_all()
    return result.status(200).end()
  } catch (error) {
    logger.log(error)
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
    logger.log(error)
    return result.status(404).end()
  }
}

const get_meta_data = (filters) => {
  return new Promise(async (resolve, reject) => {
    let { limit, offset } = filters
    let [{ sum }] = await db_helper.get(query.get_sum_rows(filters))
    const meta_data = {
      sum_rows: sum,
      limit: limit,
      page: offset == 0 ? 1 : JSON.parse(Math.ceil(offset / limit)) + 1,
      sum_pages: Math.ceil(sum / limit),
    }
    return resolve(meta_data)
  })
}

module.exports = {
  create_event,
  get_event,
  get_events,
  update_event,
  delete_event,
}
