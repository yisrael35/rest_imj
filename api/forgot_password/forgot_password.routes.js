const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { forgot_password, change_password } = require('./forgot_password.controller')

const router = express.Router()

router.post('/', forgot_password)
router.put('/', checkJWT, change_password)

module.exports = router
