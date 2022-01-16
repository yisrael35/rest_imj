const sql = require('./db')

// get data from database
const get = (sql_query) => {
  return new Promise((resolve, reject) => {
    sql.query(`${sql_query}`, (err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res)
    })
  })
}

// update in database
const update = (query, data) => {
  return new Promise((resolve, reject) => {
    try {
      sql.query(`${query}`, Object.values(data), (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    } catch (error) {
      return reject(error)
    }
  })
}

// update in database
const update_just_query = (query) => {
  return new Promise((resolve, reject) => {
    try {
      sql.query(`${query}`, (err, res) => {
        if (err) return resolve({ err })
        return resolve({ res })
      })
    } catch (err) {
      resolve({ err })
    }
  })
}

module.exports = {
  get,
  update,
  update_just_query,
}
