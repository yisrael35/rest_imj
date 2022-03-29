const create_client = (details) => {
  return `
  INSERT INTO client (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_client_by_uuid = (uuid) => {
  return `
  SELECT *
  FROM client WHERE uuid = '${uuid}' AND is_active = 1;`
}

const get_clients = ({ search, limit, offset }) => {
  return `
  SELECT *
  FROM client
  WHERE
  ${search ? ` email LIKE '%${search}%'  OR phone LIKE '%${search}%'  OR name LIKE '%${search}%' OR type LIKE '%${search}%'  AND` : ''}
  is_active = 1
  LIMIT ${limit} OFFSET ${offset}
    ;`
}

const get_sum_rows = ({ search }) => {
  return `
    SELECT 
    COUNT(DISTINCT id) AS sum
    FROM client 
    WHERE
    ${search ? ` email LIKE '%${search}%'  OR phone LIKE '%${search}%'  OR name LIKE '%${search}%' OR type LIKE '%${search}%'  AND` : ''}
    is_active = 1    ;`
}

const update_client = (client, uuid) => {
  return `
  UPDATE client 
  SET ${Object.keys(client).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

const delete_client = (id) => {
  return `
  DELETE FROM client WHERE id = '${id}'; 
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
