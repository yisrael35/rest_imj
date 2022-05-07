const get_event_type = (id) => {
  return `
  SELECT *
  FROM event_type WHERE id = '${id}';`
}
const get_user = (id) => {
  return `
  SELECT *
  FROM user WHERE id = '${id}';`
}
const get_bid_id_by_uuid = (uuid) => {
  return `
  SELECT *
  FROM bid WHERE uuid = '${uuid}';`
}

const get_bid_by_id = (id) => {
  return `
  SELECT *
  FROM bid WHERE id = '${id}';`
}

const get_event_id_by_uuid = (uuid) => {
  return `
  SELECT *
  FROM event WHERE uuid = '${uuid}';`
}
const get_location_by_id = (id) => {
  return `
  SELECT *
  FROM location WHERE id = '${id}';`
}

const get_schedule_event_by_bid_id = (bid_id) => {
  return `
  SELECT *
  FROM schedule_event WHERE bid_id = '${bid_id}';`
}

const get_cost_by_bid_id = (bid_id) => {
  return `
  SELECT *
  FROM cost WHERE bid_id = '${bid_id}';`
}

const get_table_by_id = (table_name, id) => {
  return (
    `
  SELECT *
  FROM ` +
    table_name +
    ` WHERE id = '${id}';`
  )
}

const update_bid = (bid, uuid) => {
  return `
  UPDATE bid 
  SET ${Object.keys(bid).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

module.exports = {
  get_event_type,
  get_bid_id_by_uuid,
  get_event_id_by_uuid,
  get_bid_by_id,
  get_location_by_id,
  get_schedule_event_by_bid_id,
  get_table_by_id,
  get_cost_by_bid_id,
  update_bid,
  get_user,
}
