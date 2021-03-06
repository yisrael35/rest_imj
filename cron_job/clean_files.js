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
      if (file !== '.gitkeep' && file !== 'logo.png') {
        // const file_path = path.join(path.resolve(), '..', 'files', file)// -- windows
        const file_path = path.join(path.resolve(), 'rest_imj', 'files', file) // -- linux
        fs.unlinkSync(file_path)
      }
    })

    logger.info('cronjob finish successfully')
  } catch (error) {
    logger.error(error)
  }
}
clean_files()
