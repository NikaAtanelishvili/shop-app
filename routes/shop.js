const express = require('express')
const router = express.Router()

// Shop controller
const shopController = require('../controllers/shop')

// Index
router.get('/', shopController.getIndex)

// Products
router.get('/products', shopController.getProducts)
router.get('/products/:productId', shopController.getProduct)

// // Cart products
router.get('/cart', shopController.getCart)
router.post('/cart', shopController.postCart)

// // Deleting cart item
router.post('/cart-delete-item', shopController.postCartDeleteProduct)

// // Ordering products
router.post('/create-order', shopController.postOrder)
router.get('/orders', shopController.getOrders)

module.exports = router
