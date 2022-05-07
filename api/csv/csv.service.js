const query = require('../../sql/queries/csv')
const db_helper = require('../../utils/db_helper')
const fs = require('fs')
const Logger = require('logplease')
const logger = Logger.create('./api/csv/csv.service.js')
const csv_generator = require('../../workers/csv_worker')
const mailUtil = require('../../utils/mail')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const path = require('path')

const create_csv = async ({ table, filters }, result) => {
  try {
    const data = await db_helper.get(query.get(table, filters))
    if (!data || !data.length) {
      return result.status(404).send("didn't find any data - try different option")
    }
    const res_csv = await csv_generator.create_csv_file(data)
    if (res_csv.status === 200) {
      const file_name = res_csv.file_name
      return result.status(200).send({ file_name })
    } else {
      return result.status(res_csv.status).end()
    }
  } catch (error) {
    logger.log(error)
    return result.status(500).end()
  }
}

const delete_csv = async (file_name, result) => {
  try {
    let file_path = `../../files/${file_name}`
    fs.unlink(file_path)
    return result.status(200).end()
  } catch (error) {
    logger.log(error)
    return result.status(404).end()
  }
}

module.exports = {
  create_csv,
  delete_csv,
}
