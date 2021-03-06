const create_token = (data) => {
  return `
  INSERT INTO token (${Object.keys(data)})
  VALUES (${Object.values(data).map((key) => '?')});`
}

const update_password = (id, password) => {
  return `
  UPDATE user 
  SET password = '${password}'
  WHERE id = '${id}';`
}
const update_user = (user, uuid) => {
  return `
  UPDATE user 
  SET ${Object.keys(user).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

const get_email_by_user_id = (id) => {
  return `
    SELECT email FROM user WHERE id = ${id};`
}
const get_email_by_username = (username) => {
  return `
    SELECT 
    id,
    uuid,
    first_name,
    last_name,
    email,
    level
    FROM user 
    WHERE username = '${username}';`
}

module.exports = {
  create_token,
  update_password,
  update_user,
  get_email_by_user_id,
  get_email_by_username,
}
