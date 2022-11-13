const express = require('express')
const router = express.Router()

// Admin controller
const adminController = require('../controllers/admin')

// route guard
const isAuth = require('../middleware/is-auth')

// Adding product
router.get('/add-product', isAuth, adminController.getAddProduct)
router.post('/add-product', adminController.postAddProduct)

// Getting admin products
router.get('/products', adminController.getAdminProducts)

// // Editing product
router.get('/edit-product/:productId', adminController.getEditProduct)
router.post('/edit-product', adminController.postEditProduct)

// // Deleting product
router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router
