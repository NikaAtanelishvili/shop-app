const Product = require('../models/product')
const Cart = require('../models/cart')
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

// product-detail
exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId, product => {
    console.log(product)
    res.render('shop/product-detail', {
      path: `/products`,
      product: product,
      pageTitle: `${product.title}'s Details`,
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

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)
  })
  res.redirect('/cart')
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
