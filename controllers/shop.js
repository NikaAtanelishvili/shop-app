const Product = require('../models/product')
const Order = require('../models/orders')
const path = require('path')
const fs = require('fs')

const STRIPE_SECRET_KEY = require('../config')

const PDFDocument = require('pdfkit')
const stripe = require('stripe')(STRIPE_SECRET_KEY)

const ITEMS_PER_PAGE = 2

// Rendering product
exports.getProducts = async (req, res, next) => {
  try {
    const totalItems = await Product.countDocuments()

    const page = +req.query.page || 1

    // Skip x amount of results, Limit limits amount of fetched data
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)

    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Products',
      path: '/products',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
    const totalItems = await Product.countDocuments()

    const page = +req.query.page || 1

    // Skip x amount of results, Limit limits amount of fetched data
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)

    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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

exports.getCheckout = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId')

    const products = user.cart.items

    const total = products.reduce(
      (acc, p) => acc + p.quantity * p.productId.price,
      0
    )

    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: products.map(p => {
        return {
          quantity: p.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: p.productId.price * 100,
            product_data: {
              name: p.productId.title,
              description: p.productId.description,
            },
          },
        }
      }),
      customer_email: req.user.email,
      success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
      cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
    })
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
      products: products,
      totalSum: total,
      sessionId: session.id,
    })
  } catch (err) {
    console.log(err)

    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

// Getting orders
exports.getCheckoutSuccess = async (req, res, next) => {
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

  const orderProducts = order.products

  const invoiceName = `invoice-${orderId}.pdf`
  const invoicePath = path.join('invoice', invoiceName)

  const pdfDoc = new PDFDocument()

  // Open in browser
  res.setHeader('Content-Type', 'application/pdf')

  // How content is serverd
  res.setHeader(`Content-Disposition`, `inline; filename="${invoiceName}"`)

  pdfDoc.pipe(fs.createWriteStream(invoicePath))
  pdfDoc.pipe(res)

  pdfDoc.fontSize(30).text('Invoice')

  let totalPrice = 0

  for (let item of orderProducts) {
    totalPrice += item.product.price
    pdfDoc.fontSize(14).text(
      `

      
Name: ${item.product.title}
Price: $ ${item.product.price}
Description: ${item.product.description}
Quantity: ${item.quantity}
`
    )
  }

  pdfDoc.fontSize(20).text(`Total price: ${totalPrice}`)

  pdfDoc.end()

  // Forward read data to response
  file.pipe(res)
}
