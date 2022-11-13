const Product = require('../models/product')
const Order = require('../models/orders')

// Rendering product
exports.getProducts = async (req, res, next) => {
  const products = await Product.find()

  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
  })
}

// Rendering product details
exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId
  const product = await Product.findById(productId)

  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products',
  })
}

// Redering index
exports.getIndex = async (req, res, next) => {
  const products = await Product.find()

  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
  })
}

// Render cart products
exports.getCart = async (req, res, next) => {
  const user = await req.user.populate('cart.items.productId')
  // .execPopulate() // to get promise

  const products = user.cart.items

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: products,
  })
}

// Adding item to cart
exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId

  const product = await Product.findById(prodId)

  await req.user.addToCart(product)

  res.redirect('/cart')
}

// Deleting cart product
exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId

  await req.user.removeFromCart(prodId)
  res.redirect('/cart')
}

// Getting orders
exports.postOrder = async (req, res, next) => {
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
}

// Rendering orders
exports.getOrders = async (req, res, next) => {
  const orders = Order.find({ 'user.userId': req.user._id })

  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders,
  })
}
