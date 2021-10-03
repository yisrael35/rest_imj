const create_client = (details) => {
  return `
  INSERT INTO client (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_client_by_uuid = (uuid) => {
  return `
  SELECT *
  FROM client WHERE uuid = '${uuid}';`
}

const get_clients = () => {
  return `
  SELECT *
  FROM client;`
}
const update_client = (client, uuid) => {
  return `
  UPDATE client 
  SET ${Object.keys(client).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

const delete_client = (uuid) => {
  return `
  UPDATE client 
  SET is_active = IF(is_active , 0,1)
  WHERE uuid = '${uuid}';`
}

module.exports = {
  create_client,
  get_client_by_uuid,
  get_clients,
  update_client,
  delete_client,
}
