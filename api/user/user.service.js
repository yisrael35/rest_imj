const query = require('../../sql/queries/user')
const db_helper = require('../../utils/db_helper')
const Logger = require('logplease')
const logger = Logger.create('./api/user/user.service.js')
const csv_generator = require('../../workers/csv_worker')

const create_user = async (payload, result) => {
  try {
    const res = await db_helper.update(query.create_user(payload), payload)
    if (!res.insertId) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(400).end()
  }
}

const get_user = async (uuid, req, result) => {
  try {
    let level = req.headers.bearerAuth.user.level
    if (level !== 1) {
      let user_id = req.headers.bearerAuth.user.id
      const user_details = await db_helper.get(query.get_user_by_uuid_and_id(uuid, user_id))
      if (!user_details.length) {
        return result.status(404).end()
      }
      return result.status(200).send(user_details[0])
    } else {
      const user_details = await db_helper.get(query.get_user_by_uuid(uuid))
      if (!user_details.length) {
        return result.status(404).end()
      }
      return result.status(200).send(user_details[0])
    }
  } catch (error) {
    logger.error(error)
    return result.status(404).end()
  }
}
const get_users = async (filters, result) => {
  try {
    const user_details = await db_helper.get(query.get_users(filters))
    if (!user_details) {
      return result.status(404).end()
    }
    if (filters.csv && filters.csv === 'true') {
      const res_csv = await csv_generator.create_csv_file(user_details)
      if (res_csv.status === 200) {
        const file_name = res_csv.file_name
        return result.status(200).send({ file_name })
      } else {
        return result.status(res_csv.status).send('failed to create csv')
      }
    }
    const meta_data = await get_meta_data(filters)
    return result.status(200).send({ users: user_details, meta_data })
  } catch (error) {
    logger.error(error)
    return result.status(404).end()
  }
}

const update_user = async (payload, uuid, req, result) => {
  try {
    //validte - admin only
    let level = req.headers.bearerAuth.user.level
    if (level !== 1) {
      let user_id = req.headers.bearerAuth.user.id
      const res = await db_helper.update(query.update_user_by_uuid_and_id(payload, uuid, user_id), payload)
      if (!res.affectedRows) {
        return result.status(404).end()
      }
      return result.status(200).end()
      //  return res.status(403).end()
    } else {
      //admin - update
      const res = await db_helper.update(query.update_user(payload, uuid), payload)
      if (!res.affectedRows) {
        return result.status(404).end()
      }
      return result.status(200).end()
    }
  } catch (error) {
    logger.error(error)
    return result.status(400).end()
  }
}

const delete_user = async (uuid, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_user(uuid))
    if (err || !res.affectedRows) {
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
  create_user,
  get_user,
  get_users,
  update_user,
  delete_user,
}
