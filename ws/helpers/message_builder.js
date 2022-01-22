const moment = require('moment')

const message_builder = ({ type, error, content, code }) => {
  return {
    type,
    error,
    content,
    code,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
  }
}

module.exports = {
  message_builder,
}
