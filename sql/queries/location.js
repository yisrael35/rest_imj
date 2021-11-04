const create_location = (details) => {
  return `
  INSERT INTO location (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_location_by_uuid = (id) => {
  return `
  SELECT *
  FROM location WHERE id = '${id}';`
}

const get_locations = () => {
  return `
  SELECT *
  FROM location;`
}
const update_location = (location, id) => {
  return `
  UPDATE location 
  SET ${Object.keys(location).map((key) => `${key} = ? `)}
  WHERE id = '${id}';`
}

const delete_location = (id) => {
  return `
  DELETE FROM location
 where id = '${id}';`
}

module.exports = {
  create_location,
  get_location_by_uuid,
  get_locations,
  update_location,
  delete_location,
}
