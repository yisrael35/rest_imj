const query = require('../../sql/queries/user')
const db_helper = require('../../utils/db_helper')

const create_user = async (payload, result) => {
  try {
    const { err, res } = await db_helper.update(query.create_user(payload), payload)
    if (err || !res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(400).end()
  }
}

const get_user = async (uuid, result) => {
  try {
    const user_details = await db_helper.get(query.get_user_by_uuid(uuid))
    if (!user_details) {
      return result.status(404).end()
    }
    return result.status(200).send(user_details)
  } catch (error) {
    console.log(error)
    return result.status(404).end()
  }
}
const get_users = async (result) => {
  try {
    const user_details = await db_helper.get(query.get_users())
    if (!user_details) {
      return result.status(404).end()
    }
    return result.status(200).send(user_details)
  } catch (error) {
    return result.status(404).end()
  }
}

const update_user = async (payload, uuid, result) => {
  try {
    const { err, res } = await db_helper.update(query.update_user(payload, uuid), payload)
    if (err || !res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
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
    return result.status(404).end()
  }
}

module.exports = {
  create_user,
  get_user,
  get_users,
  update_user,
  delete_user,
}
