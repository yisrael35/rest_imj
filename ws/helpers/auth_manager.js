const jwt = require('jsonwebtoken')
const query = require('../../sql/queries/auth')
const dbHelper = require('../../utils/db_helper')
const AceBase64Crypto = require('../../utils/AceBase64Crypto')
const Logger = require('logplease')
const logger = Logger.create('./ws/helper/auth_manager.js')
require('dotenv').config()

const checkJWT = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (token === null) {
        return reject('Unauthorized')
      }

      let [res] = await dbHelper.get(query.check_token_is_active(token))
      if (res) {
        if (!res.is_active) {
          return reject('Unauthorized')
        }
      } else {
        return reject('Unauthorized')
      }

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, dataToken) => {
        if (err) {
          return reject('Unauthorized')
        }

        const data = await AceBase64Crypto.decrypt(dataToken.data)
        return resolve(data)
      })
    } catch (error) {
      logger.error(`Failed to Authenticate ws token, The error: ${error}`)
    }
  })
}

module.exports = { checkJWT }
