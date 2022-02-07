const query = require('../../sql/queries/supplier')
const db_helper = require('../../utils/db_helper')

const create_supplier = async (payload, result) => {
  try {
    const res = await db_helper.update(query.create_supplier(payload), payload)
    if (!res.insertId) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    console.log(error)
    return result.status(400).end()
  }
}

const get_supplier = async (uuid, result) => {
  try {
    const supplier_details = await db_helper.get(query.get_supplier_by_uuid(uuid))
    if (!supplier_details.length) {
      return result.status(404).end()
    }
    return result.status(200).send(supplier_details[0])
  } catch (error) {
    console.log(error)
    return result.status(404).end()
  }
}
const get_suppliers = async (filters, result) => {
  try {
    const supplier_details = await db_helper.get(query.get_suppliers(filters))
    if (!supplier_details) {
      return result.status(404).end()
    }
    const meta_data = await get_meta_data(filters)
    return result.status(200).send({ suppliers: supplier_details, meta_data })
  } catch (error) {
    return result.status(404).end()
  }
}

const update_supplier = async (payload, uuid, result) => {
  try {
    const res = await db_helper.update(query.update_supplier(payload, uuid), payload)
    if (!res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(400).end()
  }
}

const delete_supplier = async (uuid, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_supplier(uuid))
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
  create_supplier,
  get_supplier,
  get_suppliers,
  update_supplier,
  delete_supplier,
}
