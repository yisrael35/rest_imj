const create_user = (details) => {
  return `
  INSERT INTO user (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_user_by_uuid = (uuid) => {
  return `
    SELECT * FROM user WHERE uuid = '${uuid}';`
}
const get_users = () => {
  return `
    SELECT * FROM user ;`
}
const update_user = (user, uuid) => {
  return `
  UPDATE user 
  SET ${Object.keys(user).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

const delete_user = (user, uuid) => {
  return `
  UPDATE user 
  SET ${Object.keys(user).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

module.exports = {
  create_user,
  get_user_by_uuid,
  get_users,
  update_user,
  delete_user,
}
