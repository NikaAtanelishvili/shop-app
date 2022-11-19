const Product = require('../models/product')

const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

/** Add Product
 * @get
 * Rendering Add Product page
 */
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: null,
    hasError: false,
    product: {
      title: '',
      imageUrl: '',
      price: '',
      description: '',
    },
    validationErrors: [],
  })
}

/** Add Product
 * @post
 * @async
 * Getting product data.
 * Creating product object.
 * Saving to Database.
 */
exports.postAddProduct = async (req, res, next) => {
  try {
    const title = req.body.title
    const price = req.body.price
    const description = req.body.description
    const imageUrl = req.body.imageUrl

    const errors = validationResult(req)

    // Validate error
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        errorMessage: errors.array()[0].msg,
        product: {
          title: title,
          imageUrl: imageUrl,
          price: price,
          description: description,
        },
        validationErrors: errors.array(),
      })
    }

    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user,
    })

    await product.save()

    res.redirect('/admin/products')
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

/** Admin Products
 * @get
 * Render Admin products
 */
exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id })

    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

/** Edit Products
 * @get
 * @async
 * Finding target product.
 * Rendering edit product page.
 */
exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit

    if (!editMode) return res.redirect('/')

    const productId = req.params.productId

    const product = await Product.findById(productId)

    if (!product) return res.redirect('/')

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

/** Edit Products
 * @post
 * @async
 * Getting product data inputs.
 * Finding product.
 * Validate user.
 * Updating product data
 */
exports.postEditProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImageUrl = req.body.imageUrl
    const updatedDesc = req.body.description

    const errors = validationResult(req)

    // Validate error
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: true,
        product: {
          title: updatedTitle,
          imageUrl: updatedImageUrl,
          price: updatedPrice,
          description: updatedDesc,
          _id: prodId,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      })
    }

    // Get edited product
    const product = await Product.findById(prodId)

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/')
    }

    // Updated product data
    product.title = updatedTitle
    product.price = updatedPrice
    product.imageUrl = updatedImageUrl
    product.description = updatedDesc

    await product.save()
    res.redirect('/admin/products')
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

/** Delete Product
 * @post
 * @async
 * Find target product.
 * Delete product.
 */
exports.postDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId

    await Product.deleteOne({ _id: prodId, userId: req.user._id })
    res.redirect('/admin/products')
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}
