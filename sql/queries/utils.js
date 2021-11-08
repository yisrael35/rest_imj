const get_event_type = () => {
  return `
    SELECT name, id FROM event_type; 
  `
}
const get_locations = () => {
  return `
    SELECT name_he AS name,  id FROM location; 
  `
}

module.exports = {
  get_event_type,
  get_locations,
}
