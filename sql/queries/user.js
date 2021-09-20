const create_user = (details) => {
  return `
  INSERT INTO user (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_user_by_uuid = (uuid) => {
  return `
    SELECT 
      uuid AS id,
      username,
      name,
      level,
      email,
      phone,
      last_login,
      is_active,
      created_at,
      updated_at
    FROM user WHERE uuid = '${uuid}';`
}
const get_user_by_uuid_and_id = (uuid, id) => {
  return `
    SELECT 
      uuid AS id,
      username,
      name,
      level,
      email,
      phone,
      last_login,
      is_active,
      created_at,
      updated_at
    FROM user WHERE uuid = '${uuid}' AND id = '${id}';`
}

const get_users = () => {
  return `
    SELECT 
      uuid AS id,
      username,
      name,
      level,
      email,
      phone,
      last_login,
      is_active,
      created_at,
      updated_at
    FROM user ;`
}
const update_user = (user, uuid) => {
  return `
  UPDATE user 
  SET ${Object.keys(user).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}
const update_user_by_uuid_and_id = (user, uuid, id) => {
  return `
  UPDATE user 
  SET ${Object.keys(user).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}' AND id = '${id}';`
}

const delete_user = (uuid) => {
  return `
  UPDATE user 
  SET is_active = IF(is_active , 0,1)
  WHERE uuid = '${uuid}';`
}

module.exports = {
  create_user,
  get_user_by_uuid,
  get_user_by_uuid_and_id,
  get_users,
  update_user,
  update_user_by_uuid_and_id,
  delete_user,
}
