const express = require('express')
const { checkJWT } = require('../../utils/Authenticate')
const { create_supplier, get_supplier, get_suppliers, update_supplier, delete_supplier } = require('./supplier.controller')

const router = express.Router()

router.get('/', checkJWT, get_suppliers) 
router.get('/:id', checkJWT, get_supplier)
router.put('/:id', checkJWT, update_supplier)
router.post('/', checkJWT, create_supplier) 
router.delete('/:id', checkJWT, delete_supplier) 

module.exports = router
