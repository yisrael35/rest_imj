const db_helper = require('../../utils/dbHelper')
const helper = require('../../utils/helper')
const query = require('../../sql/queries/forgot_password')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const mailUtil = require('../../utils/mail')
const { check_password } = require('../../utils/helper')

const ForgotPassword = () => {}

ForgotPassword.forgotPassword = async (payload, result) => {
  try {
    const { user_ip } = payload
    const UNPROCESSED_DATA = payload.forgotPassword
    const PROCESSED_DATA = process_payload(UNPROCESSED_DATA)
    const [user] = await db_helper.get(query.get_email_by_user_name_or_email(PROCESSED_DATA))
    const location = await helper.get_location(user_ip)
    if (!user) throw Error(403)

    const exp = '1h'
    const dataPayload = {
      user: {
        id: user.user_id,
      },
    }

    const token = await JWT_sing(exp, dataPayload)

    const UNPROCESSED_DATA_SESSION = {
      user_id: user.user_id,
      type: 'reset_password',
      platform: 'cpanel',
      api: 'rest',
      token,
      location,
    }
    const PROCESSED_DATA_SESSION = process_payload(UNPROCESSED_DATA_SESSION)
    await db_helper.update(query.save_session(PROCESSED_DATA_SESSION), PROCESSED_DATA_SESSION)

    const msg = {
      to: user.email,
      from: `no-reply@${process.env.DOMAIN_URL}`,
      subject: 'Enigma: Registration verification',
      html: mailUtil.forgotPassword(`${process.env.REDIRECT_URL_FORGOT_PASSWORD}/forgotpassword/${token}`),
    }

    sgMail.send(msg, async (err, res) => {
      if (err) {
        reject(err)
      } else {
        return result({ status: 200, data: { email: helper.return_encrypt_email(user.email) } })
      }
    })
  } catch (error) {
    console.log(error)
    if (error.message) return result({ status: Number(error.message) })
    result({ status: 500 })
  }
}

ForgotPassword.changePassword = async (payload, result) => {
  try {
    const { password } = payload.forgotPasswordChangePassword
    const { id: user_id } = payload.earerAuth.dataToken.user

    const is_valid_psw = check_password(password)
    if (!is_valid_psw) {
      return result({ status: 400 })
    }
    const [user] = await db_helper.get(query.get_email_by_user_id(user_id))
    if (!user) {
      return result({ status: 400 })
    }

    const UNPROCESSED_DATA_SESSION = {
      password,
    }

    const PROCESSED_DATA_SESSION = process_payload(UNPROCESSED_DATA_SESSION)
    await db_helper.update(query.change_password(PROCESSED_DATA_SESSION, user.id), PROCESSED_DATA_SESSION)

    const msg = {
      to: user.email,
      from: `no-reply@${process.env.DOMAIN_URL}`,
      subject: 'Enigma: Password Changed',
      html: mailUtil.confirmChangePassword(),
    }

    sgMail.send(msg, async (err, res) => {
      if (err) {
        console.log(err)
        return result({ status: 400 })
      } else {
        result({ status: 200 })
      }
    })
  } catch (error) {
    console.log(error)
    if (error.message && error.message) return result({ status: 403 })
    return result({ status: 500 })
  }
}

module.exports = ForgotPassword

function process_payload(payload) {
  try {
    const processed_payload = {}
    for (const [key, val] of Object.entries(payload)) {
      switch (key) {
        case 'input':
          processed_payload.input = val.trim()
          break
        case 'user_id':
          processed_payload.user_id = val
          break
        case 'type':
          processed_payload.type = val
          break
        case 'platform':
          processed_payload.platform = val
          break
        case 'api':
          processed_payload.api = val
          break
        case 'token':
          processed_payload.token = val
          break
        case 'location':
          processed_payload.location = val ? JSON.stringify(val) : null
          break
        case 'password':
          processed_payload.password = val
          break
        default:
          throw new Error('Error')
      }
    }
    return processed_payload
  } catch (error) {
    throw new Error('Error')
  }
}

function JWT_sing(exp, dataPayload) {
  return new Promise(async (resolve, reject) => {
    jwt.sign({ data: dataPayload, algorithm: 'HS256', expiresIn: exp }, process.env.KEY_FORGOT_PASSWORD, async (err, token) => {
      if (err) reject(new Error(403))
      return resolve(token)
    })
  })
}
