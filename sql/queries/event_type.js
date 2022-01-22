const create_event_type = (details) => {
  return `
  INSERT INTO event_type (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_event_type_by_id = (id) => {
  return `
  SELECT *
  FROM event_type WHERE id = '${id}';`
}

const get_event_types = () => {
  return `
  SELECT *
  FROM event_type;`
}
const update_event_type = (event_type, id) => {
  return `
  UPDATE event_type 
  SET ${Object.keys(event_type).map((key) => `${key} = ? `)}
  WHERE id = '${id}';`
}

const delete_event_type = (id) => {
  return `
  DELETE FROM event_type
 where id = '${id}';`
}

module.exports = {
  create_event_type,
  get_event_type_by_id,
  get_event_types,
  update_event_type,
  delete_event_type,
}
