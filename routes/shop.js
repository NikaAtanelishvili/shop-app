const express = require('express')

const router = express.Router()
const adminData = require('./admin')

// get ( exact match )
router.get('/', (req, res, next) => {
  const products = adminData.products
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',

    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCss: true,
  })
})

module.exports = router
