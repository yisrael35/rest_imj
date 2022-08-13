const query = require('../../sql/queries/auth')
const db_helper = require('../../utils/db_helper')
const jwt = require('jsonwebtoken')
const AceBase64Crypto = require('../../utils/AceBase64Crypto')
const helper = require('../../utils/helper')
const send_sms = require('../../utils/send_sms')
const mailUtil = require('../../utils/mail')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const Logger = require('logplease')
const logger = Logger.create('api/auth/auth.service.js')
const EXP_TOKEN = '1d'
const ALG_TOKEN = 'HS256'

//login
const sign_in = async (payload, result) => {
  try {
    const [user] = await db_helper.get(query.login(payload))
    if (!user) {
      return result.status(403).end()
    }
    if (process.env.TWO_FA_STATUS === 'false') {
      const type = 'platform'
      const two_fa_status = process.env.TWO_FA_STATUS
      const user_details = await create_token({ type, user })
      user_details.two_fa_status = two_fa_status
      return result.status(200).send(user_details)
    } else {
      const type = 'login'
      const code = helper.generate_six_digits()
      const user_details = await create_token({ type, user, code })
      user_details.phone = helper.return_encrypt_phone(user.phone)
      user_details.email = helper.return_encrypt_email(user.email)
      return result.status(200).send(user_details)
    }
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
  }
}

//register
const sign_up = async (payload, result) => {
  try {
    await db_helper.update(query.create_user(payload), payload)
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
  }
}

const sign_out = async (payload, result) => {
  try {
    const token = payload.bearerAuth.token
    const { err, res } = await db_helper.update_just_query(query.delete_token(token))
    if (err) {
      return result.status(404).end()
    }
    if (!res.affectedRows) {
      return result.status(404).end()
    }

    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(404).end()
  }
}

const update_two_fa_status = async (payload, result) => {
  try {
    process.env.TWO_FA_STATUS = payload.two_fa_status
    const data = { two_fa_status: process.env.TWO_FA_STATUS }
    return result.status(200).send(data)
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
  }
}

const send_six_digits = async (payload, result) => {
  try {
    const [res_user] = await db_helper.get(query.get_user_by_id(payload.user_id))
    if (!res_user) {
      return result.status(404).send('Failed to find user')
    }
    const [res_token] = await db_helper.get(query.check_token_in_db(payload.token))
    if (!res_token) {
      return result.status(403).send('Failed to find token')
    }

    if (res_token.send_counter > process.env.AUTH_SEND_LIMIT) {
      await db_helper.get(query.delete_token(payload.token))
      return result.status(403).send(`You reached the limit of sending to sms/email`)
    }
    const token_data = { send_counter: res_token.send_counter + 1 }
    await db_helper.update(query.update_token(payload.token, token_data), token_data)

    const { code } = res_token
    if (payload.send_code_to === 'sms') {
      const phone = '+972' + res_user.phone
      const message = `The verification code for IMJ, is: ${code}`
      const res_sms = await send_sms.send_sms(phone, message)
      if (res_sms.status === 200) {
        return result.status(200).end()
      } else {
        return result.status(400).end()
      }
    } else if (payload.send_code_to === 'email') {
      const msg = {
        to: res_user.email,
        from: `${process.env.IMJ_FROM}`,
        subject: 'IMJ: verification code',
        html: mailUtil.six_digits(`${code}`),
      }
      sgMail.send(msg, async (err, res) => {
        if (err) {
          return result.status(500).end()
        } else {
          return result.status(200).send({ status: 200, data: { email: helper.return_encrypt_email(res_user.email) } })
        }
      })
    }
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
  }
}

const validate_six_digits = async (payload, result) => {
  try {
    const [user] = await db_helper.get(query.get_user_by_id(payload.user_id))
    if (!user) {
      return result.status(404).send('Failed to find user')
    }
    const [res_token] = await db_helper.get(query.check_token_in_db(payload.token))
    if (!res_token) {
      return result.status(403).send('Failed to find token')
    }

    if (res_token.tries_counter > process.env.AUTH_TRIES_LIMIT) {
      await db_helper.get(query.delete_token(payload.token))
      return result.status(403).send(`You reached the maximum of tries`)
    }

    if (payload.code !== res_token.code) {
      const token_data = { tries_counter: res_token.tries_counter + 1 }
      await db_helper.update(query.update_token(payload.token, token_data), token_data)
      return result.status(403).send('Failed to authenticate code')
    }

    const two_fa_status = process.env.TWO_FA_STATUS
    const type = 'platform'
    const user_details = await create_token({ type, user })
    user_details.two_fa_status = two_fa_status

    return result.status(200).send(user_details)
  } catch (error) {
    logger.error(error)
    return result.status(500).end()
  }
}

module.exports = {
  sign_in,
  sign_out,
  sign_up,
  update_two_fa_status,
  send_six_digits,
  validate_six_digits,
}

// create token
const create_token = ({ user, type, code }) => {
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
        await save_token_in_db({ code, type, token, user_id: user.id })

        const user_details = {
          user: {
            name: user.first_name + ' ' + user.last_name,
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

// create token in database
const save_token_in_db = ({ code, type, token, user_id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token_details = {
        content: token,
        user_id,
        type,
        code,
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
