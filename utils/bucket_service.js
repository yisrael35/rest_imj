const fs = require('fs')
const path = require('path')
const Client = require('ssh2-sftp-client')
const Logger = require('logplease')
const logger = Logger.create('utils/bucket_service.js')

const files_path_in_bucket = './imj_files/'
let cert_name = process.env.CERT_NAME
let cert_path_file = path.join(path.resolve(), 'certificates', cert_name)

const payload = {
  username: process.env.BUCKET_USERNAME,
  host: process.env.BUCKET_URL,
  privateKey: fs.readFileSync(cert_path_file),
}

const upload_file_to_bucket = async (file) => {
  return new Promise(async (resolve, reject) => {
    const sftp = new Client()
    sftp
      .connect(payload)
      .then(async (data) => {
        const file_path_src = './files/' + file
        const res = await sftp.fastPut(file_path_src, `${files_path_in_bucket}${file}`)
        sftp.end()
        return resolve(res)
      })
      .catch((err) => {
        logger.error(`Error: ${err.message}`)
        return reject('err')
      })
  })
}

const download_file_from_bucket = async (file, local_filename) => {
  return new Promise(async (resolve, reject) => {
    const sftp = new Client()

    sftp
      .connect(payload)
      .then(() => {
        return sftp.list(files_path_in_bucket)
      })
      .then(async (data) => {
        await sftp.fastGet(files_path_in_bucket + file, local_filename)
        sftp.end()
        return resolve('ok')
      })
      .catch((err) => {
        logger.error(`Error: ${err.message}`)
        return reject('err')
      })
  })
}

module.exports = {
  upload_file_to_bucket,
  download_file_from_bucket,
}
