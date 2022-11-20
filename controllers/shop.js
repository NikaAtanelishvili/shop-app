const Product = require('../models/product')
const Order = require('../models/orders')
const path = require('path')
const fs = require('fs')

// Rendering product
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()

    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

// Rendering product details
exports.getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId
    const product = await Product.findById(productId)

    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

// Redering index
exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find()

    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

// Render cart products
exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId')
    // .execPopulate() // to get promise

    const products = user.cart.items

    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

// Adding item to cart
exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId

    const product = await Product.findById(prodId)

    await req.user.addToCart(product)

    res.redirect('/cart')
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

// Deleting cart product
exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId

    await req.user.removeFromCart(prodId)
    res.redirect('/cart')
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

// Getting orders
exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId')

    const products = user.cart.items.map(i => {
      // productId is product data
      return { quantity: i.quantity, product: { ...i.productId._doc } }
    })

    const order = new Order({
      products: products,
      user: {
        email: req.user.email,
        userId: req.user,
      },
    })
    await order.save()

    await req.user.clearCart()
    res.redirect('/orders')
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

// Rendering orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })

    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId

  const order = await Order.findById(orderId)

  if (!order) return next(new Error('No order found'))

  if (order.user.userId.toString() !== req.user._id.toString()) {
    return next(new Error('Unauthoried'))
  }

  const invoiceName = `invoice-${orderId}.pdf`
  const invoicePath = path.join('invoice', invoiceName)
  fs.readFile(invoicePath, (err, data) => {
    if (err) return next(err)

    // Open in browser
    res.setHeader('Content-Type', 'application/pdf')

    // How content is serverd
    res.setHeader(`Content-Disposition`, `inline; filename="${invoiceName}"`)
    res.send(data)
  })
}
