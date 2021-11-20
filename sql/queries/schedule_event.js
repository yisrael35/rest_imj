const create_schedule_event = (details) => {
  return `
  INSERT INTO schedule_event (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_schedule_event_by_uuid = (id) => {
  return `
  SELECT *
  FROM schedule_event WHERE id = '${id}';`
}

const get_schedule_events = () => {
  return `
  SELECT *
  FROM schedule_event;`
}
const update_schedule_event = (schedule_event, id) => {
  return `
  UPDATE schedule_event 
  SET ${Object.keys(schedule_event).map((key) => `${key} = ? `)}
  WHERE id = '${id}';`
}

const delete_schedule_event = (id) => {
  return `
  DELETE FROM schedule_event
  WHERE id = '${id}';`
}

const get_bid_id_by_uuid = (uuid) => {
  return `
  SELECT id AS bid_id
  FROM bid WHERE uuid = '${uuid}';`
}
const get_event_id_by_uuid = (uuid) => {
  return `
  SELECT id AS event_id
  FROM event WHERE uuid = '${uuid}';`
}

module.exports = {
  create_schedule_event,
  get_schedule_event_by_uuid,
  get_bid_id_by_uuid,
  get_event_id_by_uuid,
  get_schedule_events,
  update_schedule_event,
  delete_schedule_event,
}
