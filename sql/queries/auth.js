const create_user = (details) => {
  return `
  INSERT INTO user (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
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
    SELECT is_active FROM token WHERE content = '${token}';`
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

module.exports = {
  login,
  create_token,
  create_user,
  get_user_by_id,
  check_token_in_db,
  check_token_is_active,
  delete_token,
}
