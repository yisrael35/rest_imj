const query = require('../../sql/queries/location')
const db_helper = require('../../utils/db_helper')

const create_location = async (payload, result) => {
  try {
    const res = await db_helper.update(query.create_location(payload), payload)
    if (!res.insertId) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    console.log(error)
    return result.status(400).end()
  }
}

const get_location = async (uuid, result) => {
  try {
    const location_details = await db_helper.get(query.get_location_by_uuid(uuid))
    if (!location_details.length) {
      return result.status(404).end()
    }
    return result.status(200).send(location_details[0])
  } catch (error) {
    console.log(error)
    return result.status(404).end()
  }
}
const get_locations = async (result) => {
  try {
    const location_details = await db_helper.get(query.get_locations())
    if (!location_details) {
      return result.status(404).end()
    }
    return result.status(200).send(location_details)
  } catch (error) {
    return result.status(404).end()
  }
}

const update_location = async (payload, uuid, result) => {
  try {
    const res = await db_helper.update(query.update_location(payload, uuid), payload)
    if (!res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(400).end()
  }
}

const delete_location = async (uuid, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_location(uuid))
    if (err || !res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(404).end()
  }
}

module.exports = {
  create_location,
  get_location,
  get_locations,
  update_location,
  delete_location,
}
