const forge = require('node-forge')
require('dotenv').config()

const PASSWORD = process.env.JWT_PAYLOAD_PASSWORD
const SALT = process.env.JWT_PAYLOAD_SALT
const IV = process.env.JWT_PAYLOAD_IV
const key = forge.pkcs5.pbkdf2(PASSWORD, SALT, 10, 16)

const decrypt = async (encrypted_msg) => {
  const bytes = forge.util.decode64(encrypted_msg)
  const decipher = forge.cipher.createDecipher('AES-CBC', key)
  decipher.start({ iv: IV })
  decipher.update(forge.util.createBuffer(bytes))
  decipher.finish()
  return JSON.parse(decipher.output.data)
}

const encrypt = (msg) => {
  const cipher = forge.cipher.createCipher('AES-CBC', key)
  cipher.start({ iv: IV })
  cipher.update(forge.util.createBuffer(JSON.stringify(msg)))
  cipher.finish()
  const encrypted = cipher.output.data
  const encrypted_and_encoded = forge.util.encode64(encrypted)
  return encrypted_and_encoded
}

module.exports.decrypt = decrypt
module.exports.encrypt = encrypt
