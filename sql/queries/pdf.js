const get_event_type = (id) => {
  return `
  SELECT fields
  FROM event_type WHERE id = '${id}';`
}
const get_bid_id_by_uuid = (uuid) => {
  return `
  SELECT *
  FROM bid WHERE uuid = '${uuid}';`
}
const get_event_id_by_uuid = (uuid) => {
  return `
  SELECT *
  FROM event WHERE uuid = '${uuid}';`
}

module.exports = {
  get_event_type,
  get_bid_id_by_uuid,
  get_event_id_by_uuid,
}
