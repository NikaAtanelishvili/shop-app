const express = require('express')

const router = express.Router()

// controller
const shopController = require('../controllers/shop')
const adminController = require('../controllers/admin')

// add-product
router.get('/add-product', adminController.getAddProduct)
router.post('/add-product', adminController.postAddProduct)

// products
router.get('/products', adminController.getAdminProducts)

module.exports = router
