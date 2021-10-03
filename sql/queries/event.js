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

const get_events = () => {
  return `
  SELECT *
  FROM event;`
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

module.exports = {
  create_event,
  get_event_by_uuid,
  get_events,
  update_event,
  delete_event,
}
