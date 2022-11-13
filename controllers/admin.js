const Product = require('../models/product')

// Rendering edit product
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  })
}

// Adding admin product
exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  })

  await product.save()
  res.redirect('/admin/products')
}

// Rendering admin products
exports.getAdminProducts = async (req, res, next) => {
  const products = await Product.find()

  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
  })
}

// Fetching and redering product that should be edited
exports.getEditProduct = async (req, res, next) => {
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
  })
}

// Saving edited products
exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDesc = req.body.description

  // Get edited product
  const product = await Product.findById(prodId)

  // Updated product data
  product.title = updatedTitle
  product.price = updatedPrice
  product.imageUrl = updatedImageUrl
  product.description = updatedDesc

  await product.save()
  res.redirect('/admin/products')
}

// Deleting product
exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId

  await Product.findByIdAndRemove(prodId)
  res.redirect('/admin/products')
}
