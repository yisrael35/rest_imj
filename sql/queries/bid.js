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

const create_client = (details) => {
  return `
  INSERT INTO client (${Object.keys(details)})
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
  c.name AS client,
  c.email AS client_email,
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
  JOIN client c ON c.id = b.client_id
  WHERE b.uuid = '${uuid}';`
}

const get_bid_costs = (uuid) => {
  return `
    SELECT 
    c.id,
    c.description,
    c.amount,
    c.unit_cost,
    c.total_cost,
    c.discount,
    c.comment
    FROM bid b 
    LEFT JOIN cost c ON c.bid_id = b.id
    WHERE b.uuid = '${uuid}';`
}

const get_bid_schedule_event = (uuid) => {
  return `
    SELECT 
    sc.id,
    sc.start_activity,
    sc.end_activity,
    sc.description
    FROM bid b 
    LEFT JOIN schedule_event sc ON sc.bid_id = b.id
    WHERE b.uuid = '${uuid}';`
}

const get_bids = ({ search, limit, offset }) => {
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
  c.name AS client,
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
  JOIN client c ON c.id = b.client_id
  ${
    search
      ? `WHERE b.id LIKE '%${search}%'  OR b.uuid LIKE '%${search}%' OR b.event_name LIKE '%${search}%'
  `
      : ''
  }
  ORDER BY created_at DESC
  LIMIT ${limit} OFFSET ${offset}
  ;`
}

const get_sum_rows = ({ search }) => {
  return `
  SELECT 
  COUNT(DISTINCT b.id) AS sum
  FROM bid b 
  JOIN location l ON l.id = b.location_id
  JOIN event_type et ON et.id = b.event_type_id
  JOIN user u ON u.id = b.user_id
  JOIN client c ON c.id = b.client_id
  ${
    search
      ? `WHERE b.id LIKE '%${search}%'  OR b.uuid LIKE '%${search}%' OR b.event_name LIKE '%${search}%'
  `
      : ''
  }

  ;`
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

const get_client_by_uuid = (uuid) => {
  return `
  SELECT id
  FROM client WHERE uuid = '${uuid}';`
}

module.exports = {
  create_bid,
  create_schedule_event,
  create_costs,
  create_client,
  get_user_by_uuid,
  get_bid_by_uuid,
  get_bid_costs,
  get_bid_schedule_event,
  get_bids,
  get_sum_rows,
  update_bid,
  delete_bid,
  get_client_by_uuid,
}
