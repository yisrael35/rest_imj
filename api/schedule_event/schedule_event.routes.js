const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_schedule_event, get_schedule_event, get_schedule_events, update_schedule_event, delete_schedule_event } = require('./schedule_event.controller')

const router = express.Router()

router.get('/', checkJWT, get_schedule_events)
router.get('/:id', checkJWT, get_schedule_event)
router.put('/:id', checkJWT, update_schedule_event)
router.post('/', checkJWT, create_schedule_event)
router.delete('/:id', checkJWT, delete_schedule_event)

module.exports = router
