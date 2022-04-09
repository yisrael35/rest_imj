const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { sign_up, sign_in, sign_out, send_six_digits, validate_six_digits, update_two_fa_status } = require('./auth.controller')

const router = express.Router()

router.post('/', checkJWT, sign_up) // only admin can signup
router.post('/send_six_digits', checkJWT, send_six_digits) //login token
router.put('/validate_six_digits', checkJWT, validate_six_digits) //login token
router.put('/two_fa', checkJWT, update_two_fa_status)
router.put('/', sign_in)
router.delete('/', checkJWT, sign_out)

module.exports = router
