const express = require('express')

const router = express.Router()

// controller
const shopController = require('../controllers/shop')

// product-list
router.get('/', shopController.getIndex)

// cart
router.get('/cart', shopController.getCart)

// product
router.get('/products', shopController.getProducts)

// checkout
router.get('/checkout', shopController.getCheckout)

// orders
router.get('/orders', shopController.getOrders)

module.exports = router
