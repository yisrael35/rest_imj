const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_cost, get_cost, get_costs, update_cost, delete_cost } = require('./cost.controller')

const router = express.Router()

router.get('/', checkJWT, get_costs)
router.get('/:id', checkJWT, get_cost)
router.put('/:id', checkJWT, update_cost)
router.post('/', checkJWT, create_cost)
router.delete('/:id', checkJWT, delete_cost)

module.exports = router
