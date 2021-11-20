const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_bid, get_bid, get_bids, update_bid, delete_bid } = require('./bid.controller')

const router = express.Router()

router.get('/', checkJWT, get_bids) 
router.get('/:id', checkJWT, get_bid)
router.put('/:id', checkJWT, update_bid)
router.post('/', checkJWT, create_bid) 
router.delete('/:id', checkJWT, delete_bid) 

module.exports = router
