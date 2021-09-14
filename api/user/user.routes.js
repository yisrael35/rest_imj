const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_user, get_user, get_users, update_user, delete_user } = require('./user.controller')

const router = express.Router()

router.get('/', checkJWT, get_users) // TODO - only admin
router.get('/:id', checkJWT, get_user)
router.put('/:id', checkJWT, update_user)
router.post('/', checkJWT, create_user)
router.delete('/:id', checkJWT, delete_user)

module.exports = router
