const jwt = require('jsonwebtoken')
const query = require('../sql/queries/auth')
const dbHelper = require('./db_helper')
const AceBase64Crypto = require('./AceBase64Crypto')
const Logger = require('logplease')
const logger = Logger.create('utils/Authenticate.js')
require('dotenv').config()

const checkJWT = async (req, response, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null) {
      return response.status(403).send()
    }

    let [res] = await dbHelper.get(query.check_token_is_active(token))
    if (res) {
      if (!res.is_active) {
        return response.status(403).send()
      }
    } else {
      return response.status(403).send()
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, dataToken) => {
      if (err) {
        return response.status(403).send()
      }
      const data = await AceBase64Crypto.decrypt(dataToken.data)
      //check the token is the correct type
      const type = res.type
      if (type !== 'platform') {
        if (type === 'login') {
          const url_path = req._parsedUrl?.path
          if (url_path !== '/send_six_digits' && url_path !== '/validate_six_digits') {
            return response.status(403).send('This token is only for login')
          }
        } else if (type === 'reset_password') {
          const base_url = req.baseUrl
          if (base_url !== '/forgot_password') {
            return response.status(403).send('This token is only for reset_password')
          }
        }
      }

      data.type = type
      data.token = token
      req.headers.bearerAuth = data
      next()
    })
  } catch (error) {
    logger.error(`Failed to Authenticate, The error: ${error}`)
  }
}

module.exports = { checkJWT }

