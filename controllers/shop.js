const Product = require('../models/product')

// Rendering product
exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products)
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      })
    })
    .catch(err => console.log(err))
}

// Rendering product details
exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      })
    })
    .catch(err => console.log(err))
}

// Redering index
exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch(err => console.log(err))
}

// Render cart products
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      })
    })
    .catch(err => console.log(err))
}

// Adding item to cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId

  Product.findById(prodId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
}

// Deleting cart product
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId

  req.user
    .deleteItemFromCart(prodId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))
}

// Getting orders
exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err))
}

// Rendering orders
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      })
    })
    .catch(err => console.log(err))
}
