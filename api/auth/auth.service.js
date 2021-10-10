const query = require('../../sql/queries/auth')
const db_helper = require('../../utils/db_helper')
const jwt = require('jsonwebtoken')
const AceBase64Crypto = require('../../utils/AceBase64Crypto')

const EXP_TOKEN = '1d'
const ALG_TOKEN = 'HS256'

//login
const sign_in = async (payload, result) => {
  try {
    const [user] = await db_helper.get(query.login(payload))
    const user_details = await get_token(user)
    return result.status(200).send(user_details)
  } catch (error) {
    return result.status(404).end()
  }
}

//register
const sign_up = async (payload, result) => {
  try {
    await db_helper.update(query.create_user(payload), payload)
    return result.status(200).end()
  } catch (error) {
    return result.status(400).end()
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
    return result.status(404).end()
  }
}

// create token in database
function create_token(token, user_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const token_details = {
        content: token,
        user_id,
      }
      db_helper.update_just_query(query.update_user(user_id))
      const res = await db_helper.update(query.create_token(token_details), token_details)
      return resolve(res)
    } catch (error) {
      return reject(error)
    }
  })
}

// create token
function get_token(user) {
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
        await create_token(token, user.id)

        const user_details = {
          user: {
            name: user.first_name + ' ' + user.last_name,
            id: user.uuid,
            level: user.level,
          },
          token: token,
        }
        return resolve(user_details)
      })
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports = {
  sign_in,
  sign_out,
  sign_up,
}
