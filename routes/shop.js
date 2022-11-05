const express = require('express')

const router = express.Router()

// controller
const shopController = require('../controllers/shop')

// product-list
router.get('/', shopController.getIndex)

// cart
router.get('/cart', shopController.getCart)

router.post('/cart', shopController.postCart)

// all product
router.get('/products', shopController.getProducts)

// product-detail
router.get('/products/:productId', shopController.getProductDetail)

// checkout
router.get('/checkout', shopController.getCheckout)

// orders
router.get('/orders', shopController.getOrders)

module.exports = router
