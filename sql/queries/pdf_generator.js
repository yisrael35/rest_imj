const get_event_type = (id) => {
  return `SELECT * from event_type WHERE id = ${id}`
}

module.exports = {
  get_event_type
}
