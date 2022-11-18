const express = require('express')
const { body } = require('express-validator')

const router = express.Router()

// Admin controller
const adminController = require('../controllers/admin')

// route guard
const isAuth = require('../middleware/is-auth')

// Adding product
router.get('/add-product', isAuth, adminController.getAddProduct)
router.post(
  '/add-product',
  [
    body('title')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Title length shoud be at least 3 characters long.'),
    body('imageUrl').isURL().withMessage('Please provide valid URL'),
    body('price')
      .isFloat()
      .withMessage('Please use float number for product price'),
    body(
      'description',
      'Description length shoud be bettwen 5 and 100 characters.'
    )
      .trim()
      .isLength({ min: 5, max: 100 }),
  ],
  adminController.postAddProduct
)

// Getting admin products
router.get('/products', adminController.getAdminProducts)

// // Editing product
router.get('/edit-product/:productId', adminController.getEditProduct)
router.post(
  '/edit-product',
  [
    body('title')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Title length shoud be at least 3 characters long.'),
    body('imageUrl').isURL().withMessage('Please provide valid URL'),
    body('price')
      .isFloat()
      .withMessage('Please use float number for product price'),
    body(
      'description',
      'Description length shoud be bettwen 5 and 100 characters.'
    )
      .trim()
      .isLength({ min: 5, max: 100 }),
  ],
  adminController.postEditProduct
)

// // Deleting product
router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router
