const express = require('express')
const router = express.Router()

// Shop controller
const shopController = require('../controllers/shop')

// route guard
const isAuth = require('../middleware/is-auth')

// Index
router.get('/', shopController.getIndex)

// Products
router.get('/products', shopController.getProducts)
router.get('/products/:productId', shopController.getProduct)

// // Cart products
router.get('/cart', isAuth, shopController.getCart)
router.post('/cart', isAuth, shopController.postCart)

// // Deleting cart item
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

// // Ordering products
router.post('/create-order', isAuth, shopController.postOrder)
router.get('/orders', isAuth, shopController.getOrders)

router.get('/orders/:orderId', isAuth, shopController.getInvoice)

module.exports = router
