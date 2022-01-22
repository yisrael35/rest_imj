const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_pdf, delete_pdf } = require('./pdf.controller')

const router = express.Router()

router.post('/', checkJWT, create_pdf)
router.delete('/:file_name', checkJWT, delete_pdf)

module.exports = router
