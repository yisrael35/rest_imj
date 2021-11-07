const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_location, get_location, get_locations, update_location, delete_location } = require('./location.controller')

const router = express.Router()

router.get('/', checkJWT, get_locations) 
router.get('/:id', checkJWT, get_location)
router.put('/:id', checkJWT, update_location)
router.post('/', checkJWT, create_location) 
router.delete('/:id', checkJWT, delete_location) 

module.exports = router
