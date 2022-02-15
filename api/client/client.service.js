const query = require('../../sql/queries/client')
const db_helper = require('../../utils/db_helper')
const Logger = require('logplease')
const logger = Logger.create('api/client/client.service.js')
const csv_generator = require('../../workers/csv_worker')

const create_client = async (payload, result) => {
  try {
    const res = await db_helper.update(query.create_client(payload), payload)
    if (!res.insertId) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(400).end()
  }
}

const get_client = async (uuid, result) => {
  try {
    const client_details = await db_helper.get(query.get_client_by_uuid(uuid))
    if (!client_details.length) {
      return result.status(404).end()
    }
    return result.status(200).send(client_details[0])
  } catch (error) {
    logger.error(error)
    return result.status(404).end()
  }
}
const get_clients = async (filters, result) => {
  try {
    const client_details = await db_helper.get(query.get_clients(filters))
    if (!client_details) {
      return result.status(404).end()
    }
    if (filters.csv && filters.csv === 'true') {
      const res_csv = await csv_generator.create_csv_file(client_details)
      if (res_csv.status === 200) {
        const file_name = res_csv.file_name
        return result.status(200).send({ file_name })
      } else {
        return result.status(res_csv.status).send('failed to create csv')
      }
    }
    const meta_data = await get_meta_data(filters)
    return result.status(200).send({ clients: client_details, meta_data })
  } catch (error) {
    logger.error(error)
    return result.status(404).end()
  }
}

const update_client = async (payload, uuid, result) => {
  try {
    const res = await db_helper.update(query.update_client(payload, uuid), payload)
    if (!res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(400).end()
  }
}

const delete_client = async (uuid, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_client(uuid))
    if (err || !res.affectedRows) {
      logger.error(err)
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
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
  create_client,
  get_client,
  get_clients,
  update_client,
  delete_client,
}
