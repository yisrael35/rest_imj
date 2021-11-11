const create_bid = (details) => {
  return `
  INSERT INTO bid (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}
const create_schedule_event = (details) => {
  return `
  INSERT INTO schedule_event (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}
const create_costs = (details) => {
  return `
  INSERT INTO cost (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_user_by_uuid = (uuid) => {
  return `
  SELECT id
  FROM user WHERE uuid = '${uuid}';`
}
const get_bid_by_uuid = (uuid) => {
  return `
  SELECT 
  b.uuid AS id,
  et.name AS event_type,
  l.name_he AS location,
  u.first_name,
  u.last_name,
  b.status,
  b.comment,
  b.total_b_discount,
  b.total_a_discount,
  b.total_discount,
  b.currency,
  b.client_name,
  b.event_name,
  b.event_date,
  b.max_participants,
  b.min_participants,
  b.created_at,
  b.updated_at
  FROM bid b 
  JOIN location l ON l.id = b.location_id
  JOIN event_type et ON et.id = b.event_type_id
  JOIN user u ON u.id = b.user_id

  WHERE uuid = '${uuid}';`
}

const get_bids = () => {
  return `
  SELECT 
  b.uuid AS id,
  et.name AS event_type,
  l.name_he AS location,
  u.first_name,
  u.last_name,
  b.status,
  b.comment,
  b.total_b_discount,
  b.total_a_discount,
  b.total_discount,
  b.currency,
  b.client_name,
  b.event_name,
  b.event_date,
  b.max_participants,
  b.min_participants,
  b.created_at,
  b.updated_at
  FROM bid b 
  JOIN location l ON l.id = b.location_id
  JOIN event_type et ON et.id = b.event_type_id
  JOIN user u ON u.id = b.user_id;`
}
const update_bid = (bid, uuid) => {
  return `
  UPDATE bid 
  SET ${Object.keys(bid).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

const delete_bid = (uuid) => {
  return `
  DELETE FROM bid WHERE uuid = '${uuid}'; 
  `
}

module.exports = {
  create_bid,
  create_schedule_event,
  create_costs,
  get_user_by_uuid,
  get_bid_by_uuid,
  get_bids,
  update_bid,
  delete_bid,
}
