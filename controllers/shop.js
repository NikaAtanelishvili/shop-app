const Product = require('../models/product')

// product-list
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      path: '/products',
      pageTitle: 'All products',
      hasProducts: products.length > 0,
    })
  })
}

// index
exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      path: '/',
      prods: products,
      pageTitle: 'Shop',
      hasProducts: products.length > 0,
    })
  })
}

// cart
exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
  })
}

// checkout
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  })
}

// orders
exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Orders',
  })
}
