const sessions = {}

const get_sessions = () => sessions

const get_session = (id) => {
  return sessions[id]
}

const add_session = (id, data) => {
  sessions[id] = data
}

const update_session = (id, data) => {
  sessions[id] = data
}

const delete_session = (id) => {
  delete sessions[id]
}


module.exports = {
  get_sessions,
  get_session,
  add_session,
  update_session,
  delete_session,
}
