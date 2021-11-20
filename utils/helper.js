const DEFAULT_LIMIT = 30
const DEFAULT_OFFSET = 0

function return_encrypt_email(email) {
  if (typeof email !== 'string') {
    email = email[0]
  }
  let split_email = email.split('@')
  split_email[0] = split_email[0][0] + '*'.repeat(split_email[0].length - 1)
  return split_email[0] + '@' + split_email[1]
}

function check_password(password) {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-,]).{8,200}/.test(password)
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/
  return re.test(email)
}

// process filters
function process_filters(payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'limit':
              if (val < 0) {
                return reject({ status: 400 })
              }
              processed_payload.limit = val
              break
            case 'offset':
              if (val < 0) {
                return reject({ status: 400 })
              }
              processed_payload.offset = val
              break
            case 'search':
              processed_payload.search = val.trim()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      processed_payload.limit = processed_payload.limit ? processed_payload.limit : DEFAULT_LIMIT
      processed_payload.offset = processed_payload.offset ? processed_payload.offset : DEFAULT_OFFSET
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process user payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  validateEmail,
  check_password,
  return_encrypt_email,
  process_filters,
}
