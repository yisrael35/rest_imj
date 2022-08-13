const moment = require('moment')

const create_user = (details) => {
  return `
  INSERT INTO user (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const update_user = (id) => {
  let now = moment().format('yyyy-MM-DD HH:mm:ss')
  return `
  UPDATE user 
  SET last_login = '${now}'
  WHERE id = '${id}';
  `
}

const login = ({ username, password }) => {
  return `
    SELECT * FROM user WHERE username = '${username}' 
    AND password = '${password}' AND is_active = 1;`
}

const get_user_by_id = (id) => {
  return `
    SELECT * FROM user WHERE id = ${id};`
}

const check_token_in_db = (token) => {
  return `
    SELECT * FROM token WHERE content = '${token}';`
}
const check_token_is_active = (token) => {
  return `
    SELECT * FROM token WHERE content = '${token}';`
}

const create_token = (data) => {
  return `
  INSERT INTO token (${Object.keys(data)})
  VALUES (${Object.values(data).map((key) => '?')});`
}

const delete_token = (content) => {
  return `
  UPDATE token 
  SET is_active = 0 
  WHERE content = '${content}';
  `
}

const update_token = (content, data) => {
  return `
  UPDATE token 
  SET ${Object.keys(data).map((key) => `${key} = ? `)}
  WHERE content = '${content}';`
}

module.exports = {
  login,
  create_token,
  create_user,
  update_user,
  get_user_by_id,
  check_token_in_db,
  check_token_is_active,
  delete_token,
  update_token,
}
