const fs = require('fs')
const path = require('path')
const Logger = require('logplease')
const logger = Logger.create('./cron_job/clean_files.js')

const clean_files = async () => {
  try {
    // const dit_path = path.join(path.resolve(), '..', 'files') // -- windows
    const dit_path = path.join(path.resolve(), 'rest_imj', 'files') // -- linux
    const files = fs.readdirSync(dit_path)
    files.forEach((file) => {
      if (file !== '.gitkeep') {
        const file_path = path.join(path.resolve(), '..', 'files', file)
        fs.unlinkSync(file_path)
      }
    })

    logger.log('cronjob finish successfully')
  } catch (error) {
    logger.error(error)
  }
}
clean_files()
