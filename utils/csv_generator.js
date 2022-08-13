const Logger = require('logplease')
const logger = Logger.create('utils/csv_generator.js')
const { parentPort } = require('worker_threads')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const path = require('path')

/**
 * create csv file - function that get array of object and create csv file in ./files folder.
 * @param {Object} data it will take from the first object it's keys and make them the headers (columns name) and accordingly it will fill the file .
 * @return {Promise<Object>} object that contain status like (200,500) and file_name in case of success, example: { file_name: 'csv_1650291071152.csv', status: 200 }.
 */
const create_csv_file = async ({ data }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let file_name

      const headers = []
      file_name = `csv_${Date.now()}.csv`

      for (const key in data[0]) {
        let record_header = {}
        record_header.id = key
        record_header.title = key
        headers.push(record_header)
      }

      const csvWriter = await createCsvWriter({
        path: path.join(path.resolve(), 'files', file_name),
        header: headers,
      })

      await csvWriter.writeRecords(data).then(async () => {
        setTimeout(() => {
          return resolve({ file_name, status: 200 })
        }, 2000)
      })
    } catch (error) {
      logger.error(error)
      return resolve({ status: 500 })
    }
  })
}


parentPort.on('message', async (data) => {
  parentPort.postMessage(await create_csv_file(data))
})
