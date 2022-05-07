const query = require('../../sql/queries/forgot_password')
const db_helper = require('../../utils/db_helper')
const jwt = require('jsonwebtoken')
const AceBase64Crypto = require('../../utils/AceBase64Crypto')
const mailUtil = require('../../utils/mail')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const helper = require('../../utils/helper')
const Logger = require('logplease')
const logger = Logger.create('./api/forgot_password/forgot_password.service.js')

const EXP_TOKEN = '20m'
const ALG_TOKEN = 'HS256'

const forgot_password = async (payload, result) => {
  try {
    const [user] = await db_helper.get(query.get_email_by_username(payload.username))
    if (!user) {
      return result.status(404).end()
    }

    const user_details = await create_token(user)
    const msg = {
      to: user.email,
      from: `${process.env.IMJ_FROM}`,
      subject: 'IMJ: Reset password',
      html: mailUtil.forgot_password(`${process.env.IMJ_URL_CLIENT}/ResetPassword/${user_details.token}`),
    }
    sgMail.send(msg, async (err, res) => {
      if (err) {
        return result.status(500).end()
      } else {
        return result.status(200).send({ status: 200, data: { email: helper.return_encrypt_email(user.email) } })
      }
    })
  } catch (error) {
    logger.error(error)
    return result.status(404).end()
  }
}

const change_password = async (payload, user_id, result) => {
  try {
    const [user] = await db_helper.get(query.get_email_by_user_id(user_id))
    if (!user) {
      return result({ status: 400 })
    }

    await db_helper.update_just_query(query.update_password(user_id, payload.password))
    const msg = {
      to: user.email,
      from: `${process.env.IMJ_FROM}`,
      subject: 'IMJ: Password Changed',
      html: mailUtil.confirm_change_password(),
    }

    sgMail.send(msg, async (err, res) => {
      if (err) {
        return result.status(500).end()
      } else {
        return result.status(200).end()
      }
    })
  } catch (error) {
    logger.error(error)
    return result.status(400).end()
  }
}

// create token in database
const save_token_in_db = ({ type, token, user_id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token_details = {
        content: token,
        user_id,
        type,
      }
      db_helper.update_just_query(query.update_user(user_id))
      const res = await db_helper.update(query.create_token(token_details), token_details)
      return resolve(res)
    } catch (error) {
      logger.error(error)
      return reject(error)
    }
  })
}

// create token
const create_token = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const exp = EXP_TOKEN
      const algorithm = ALG_TOKEN
      const payload = {
        user: {
          id: user.id,
          level: user.level,
        },
      }
      const encrypted_and_encoded = await AceBase64Crypto.encrypt(payload)

      jwt.sign({ data: encrypted_and_encoded, algorithm }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: exp }, async (err, token) => {
        if (err) {
          throw err
        }
        const type = 'reset_password'
        await save_token_in_db({ type, token, user_id: user.id })

        const user_details = {
          user: {
            name: user.name,
            id: user.uuid,
            level: user.level,
          },
          token,
          type,
        }
        return resolve(user_details)
      })
    } catch (error) {
      logger.error(error)
      return reject(error)
    }
  })
}

module.exports = {
  forgot_password,
  change_password,
}
