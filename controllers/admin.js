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
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
  })
  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch(err => {
      console.log(err)
    })
}

// Rendering admin products
exports.getAdminProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch(err => console.log(err))
}

// Fetching and redering product that should be edited
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const productId = req.params.productId

  Product.findById(productId)
    .then(product => {
      if (!product) return res.redirect('/')

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      })
    })
    .catch(err => console.log(err))
}

// Saving edited products
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDesc = req.body.description

  // Get edited product
  Product.findById(prodId)
    .then(product => {
      // Updated product data
      product.title = updatedTitle
      product.price = updatedPrice
      product.imageUrl = updatedImageUrl
      product.description = updatedDesc

      return product.save()
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err))
}

// Deleting product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId

  Product.deleteById(prodId)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err))
}
