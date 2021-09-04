const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { sign_up, sign_in, sign_out } = require('./auth.controller')

const router = express.Router()

router.post('/', sign_up)
router.put('/', sign_in)
router.delete('/', checkJWT, sign_out)

module.exports = router
