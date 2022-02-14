const Logger = require('logplease')
const logger = Logger.create('workers/csv_worker.js')
const { StaticPool } = require('node-worker-threads-pool')

//Create new worker
const pool = new StaticPool({
  size: 2,
  task: "./utils/csv_generator.js"
});
logger.log('create csv threads-pool successfully')

const create_csv_file = (data) => {
  return new Promise(async (resolve, reject) => {
    pool.exec({ data }).then((result) => {
      return resolve(result)
    })
    
  })
}

module.exports = { create_csv_file }
