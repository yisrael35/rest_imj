const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_event, get_event, get_events, update_event } = require('./event.controller')

const router = express.Router()

router.get('/', checkJWT, get_events)
router.get('/:id', checkJWT, get_event)
router.put('/:id', checkJWT, update_event)
router.post('/', checkJWT, create_event)
// router.delete('/:id', checkJWT, delete_event)

module.exports = router
