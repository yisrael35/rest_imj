const create_event = (details) => {
  return `
  INSERT INTO event (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_event_by_uuid = (uuid) => {
  return `
  SELECT *
  FROM event WHERE uuid = '${uuid}';`
}

const get_events = ({ search, limit, offset }) => {
  return `
  SELECT *
  FROM event
  ${search ? `WHERE id LIKE '%${search}%'  OR uuid LIKE '%${search}%' ` : ''}
  ORDER BY created_at DESC
  LIMIT ${limit} OFFSET ${offset}
  ;`
}
const get_sum_rows = ({ search }) => {
  return `
  SELECT *
  FROM event
  ${search ? `WHERE id LIKE '%${search}%'  OR uuid LIKE '%${search}%'` : ''}
  ;`
}
const update_event = (event, uuid) => {
  return `
  UPDATE event 
  SET ${Object.keys(event).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

const delete_event = (uuid) => {
  return `
  UPDATE event 
  SET is_active = IF(is_active , 0,1)
  WHERE uuid = '${uuid}';`
}

const get_user_by_uuid = (uuid) => {
  return `
  SELECT id
  FROM user WHERE uuid = '${uuid}';`
}

const get_clients_by_uuids = (uuids) => {
  return `
  SELECT id
  FROM client 
  WHERE uuid IN (${uuids.map((item) => `'${item}'`)});`
}

module.exports = {
  create_event,
  get_event_by_uuid,
  get_events,
  get_sum_rows,
  update_event,
  delete_event,
  get_user_by_uuid,
  get_clients_by_uuids,
}
