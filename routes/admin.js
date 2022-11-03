const express = require('express')

const router = express.Router()

// controller
const productsController = require('../controllers/products')

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct)

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct)

module.exports = router
