const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_csv, delete_csv } = require('./csv.controller')

const router = express.Router()

router.get('/', checkJWT, create_csv)
router.delete('/:file_name', checkJWT, delete_csv)

module.exports = router
