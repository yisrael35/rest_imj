const query = require('../../sql/queries/supplier')
const db_helper = require('../../utils/db_helper')
const Logger = require('logplease')
const logger = Logger.create('./api/supplier/supplier.service.js')
const csv_generator = require('../../workers/csv_worker')

const create_supplier = async (payload, result) => {
  try {
    const res = await db_helper.update(query.create_supplier(payload), payload)
    if (!res.insertId) {
      return result.status(400).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
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
    logger.error(error)
    return result.status(500).end()
  }
}
const get_suppliers = async (filters, result) => {
  try {
    const supplier_details = await db_helper.get(query.get_suppliers(filters))
    if (!supplier_details) {
      return result.status(404).end()
    }
    if (filters.csv && filters.csv === 'true') {
      const res_csv = await csv_generator.create_csv_file(supplier_details)
      if (res_csv.status === 200) {
        const file_name = res_csv.file_name
        return result.status(200).send({ file_name })
      } else {
        return result.status(res_csv.status).send('failed to create csv')
      }
    }
    const meta_data = await get_meta_data(filters)
    return result.status(200).send({ suppliers: supplier_details, meta_data })
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
  }
}

const update_supplier = async (payload, uuid, result) => {
  try {
    const res = await db_helper.update(query.update_supplier(payload, uuid), payload)
    if (!res.affectedRows) {
      return result.status(400).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
  }
}

const delete_supplier = async (uuid, result) => {
  try {
    const [res_supplier] = await db_helper.get(query.get_supplier_by_uuid(uuid))
    if (!res_supplier) {
      return result.status(404).end()
    }

    const supplier_data = { is_active: 0 }
    const res = await db_helper.update(query.update_supplier(supplier_data, uuid), supplier_data)
    if (!res.affectedRows) {
      return result.status(400).end()
    }
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
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
