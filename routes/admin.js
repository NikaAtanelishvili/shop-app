const express = require('express')

const router = express.Router()

// controller
const adminController = require('../controllers/admin')

// add-product
router.get('/add-product', adminController.getAddProduct)
router.get('/products', adminController.getAdminProducts)
router.post('/add-product', adminController.postAddProduct)

// products

router.get('/edit-product/:productId', adminController.getEditProduct)

router.post('/edit-product', adminController.postEditProduct)
module.exports = router
