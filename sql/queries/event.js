const create_event = (details) => {
  return `
  INSERT INTO event (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_event_by_uuid = (uuid) => {
  return `
  SELECT 
  e.uuid AS id,
  e.name,
  u.first_name AS user,
  e.from_date,
  e.to_date,
  e.status,
  e.type,
  e.clients,
  e.comment,
  e.check_list,
  e.suppliers,
  e.budget
  FROM event e
  JOIN user u ON u.id = e.user_id
  WHERE e.uuid = '${uuid}';`
}

const get_events = ({ search, limit, offset, from_date, to_date, status }) => {
  return `
  SELECT 
    e.uuid AS id,
    e.name,
    u.first_name,
    e.from_date,
    e.to_date,
    e.status,
    e.type,
    e.comment
  FROM event e
  JOIN user u ON u.id = e.user_id
  WHERE
  ${from_date ? `e.from_date >= '${from_date}' AND` : ''}
  ${to_date ? `e.to_date <= '${to_date}' AND` : ''}
  ${search ? ` e.id LIKE '%${search}%'  OR e.uuid LIKE '%${search}%' AND ` : ''}
  ${status ? `e.status = '${status}' AND` : ''}
  1=1
  ORDER BY e.created_at DESC
  ${limit ? ` LIMIT ${limit}` : ''}  ${offset ? ` OFFSET ${offset}` : ''}
  ;`
}

const get_sum_rows = ({ search, from_date, to_date }) => {
  return `
  SELECT count(id) AS sum
  FROM event
  WHERE
  ${from_date ? `from_date >= '${from_date}' AND` : ''}
  ${to_date ? `to_date <= '${to_date}' AND` : ''}
  ${search ? ` id LIKE '%${search}%'  OR uuid LIKE '%${search}%' AND` : ''}
  1 = 1
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
const get_bid_by_uuid = (uuid) => {
  return `
  SELECT id
  FROM bid WHERE uuid = '${uuid}';`
}

const get_clients_by_uuids = (uuids) => {
  return `
  SELECT id
  FROM client 
  WHERE uuid IN (${uuids.map((item) => `'${item}'`)});`
}
const get_suppliers_by_uuids = (uuids) => {
  return `
  SELECT id
  FROM supplier 
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
  get_bid_by_uuid,
  get_clients_by_uuids,
  get_suppliers_by_uuids,
}
