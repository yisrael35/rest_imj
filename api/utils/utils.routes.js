const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { get_utils } = require('./utils.controller')

const router = express.Router()

router.get('/', checkJWT, get_utils) 
module.exports = router
