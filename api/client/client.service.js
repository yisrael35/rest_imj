const query = require('../../sql/queries/client')
const db_helper = require('../../utils/db_helper')

const create_client = async (payload, result) => {
  try {
    const res = await db_helper.update(query.create_client(payload), payload)
    if (!res.insertId) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    console.log(error)
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
    console.log(error)
    return result.status(404).end()
  }
}
const get_clients = async (filters, result) => {
  try {
    const client_details = await db_helper.get(query.get_clients(filters))
    if (!client_details) {
      return result.status(404).end()
    }
    const meta_data = await get_meta_data(filters)
    return result.status(200).send({ clients: client_details, meta_data })
  } catch (error) {
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
    return result.status(400).end()
  }
}

const delete_client = async (uuid, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_client(uuid))
    if (err || !res.affectedRows) {
      console.log(err)
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
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
