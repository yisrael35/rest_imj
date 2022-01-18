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

const get_clients = ({ search, limit, offset }) => {
  return `
  SELECT *
  FROM client
  ${search ? `WHERE email LIKE '%${search}%'  OR phone LIKE '%${search}%'  OR name LIKE '%${search}%' OR type LIKE '%${search}%'` : ''}
    LIMIT ${limit} OFFSET ${offset}
    ;`
}

const get_sum_rows = ({ search }) => {
  return `
    SELECT 
    COUNT(DISTINCT id) AS sum
    FROM client 
    ${search ? `WHERE  email LIKE '%${search}%'  OR phone LIKE '%${search}%'  OR name LIKE '%${search}%' OR type LIKE '%${search}%'` : ''}
    ;`
}

const update_client = (client, uuid) => {
  return `
  UPDATE client 
  SET ${Object.keys(client).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

const delete_client = (uuid) => {
  return `
  DELETE FROM client WHERE uuid = '${uuid}'; 
  `
}

module.exports = {
  create_client,
  get_client_by_uuid,
  get_clients,
  update_client,
  delete_client,
  get_sum_rows,
}
