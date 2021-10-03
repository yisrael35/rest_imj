const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_client, get_client, get_clients, update_client, delete_client } = require('./client.controller')

const router = express.Router()

router.get('/', checkJWT, get_clients) 
router.get('/:id', checkJWT, get_client)
router.put('/:id', checkJWT, update_client)
router.post('/', checkJWT, create_client) 
router.delete('/:id', checkJWT, delete_client) 

module.exports = router
