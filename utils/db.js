const mysql = require('mysql')
require('dotenv').config()

const Logger = require('logplease')
const logger = Logger.create('./utils/db.js')

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

// open the MySQL connection
connection.connect((error) => {
  if (error) throw error
  logger.log(`Successfully connected to database: ${process.env.DB_NAME}.`)
})

module.exports = connection
