const Logger = require('logplease')
const logger = Logger.create('workers/csv_worker.js')
const { Worker } = require('worker_threads')

//Create new worker
const worker = new Worker('./utils/csv_generator.js')
logger.log('create csv worker successfully')

const create_csv_file = (data) => {
  return new Promise(async (resolve, reject) => {
    worker.postMessage({ data })

    //Listen for a message from worker
    worker.on('message', (result) => {
      return resolve(result)
    })
    worker.on('error', (error) => {
      logger.error(error)
    })
  })
}

module.exports = { create_csv_file }
