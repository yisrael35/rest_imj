const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_event_type, get_event_type, get_event_types, update_event_type, delete_event_type } = require('./event_type.controller')

const router = express.Router()

router.get('/', checkJWT, get_event_types) 
router.get('/:id', checkJWT, get_event_type)
router.put('/:id', checkJWT, update_event_type)
router.post('/', checkJWT, create_event_type) 
router.delete('/:id', checkJWT, delete_event_type) 


module.exports = router
