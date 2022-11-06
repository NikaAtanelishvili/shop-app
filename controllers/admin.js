const Product = require('../models/product')

// add-products [get]
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false,
  })
}
// add-products [POST]
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description

  // NULL for id ( to see if product already exists  ) need for editing product
  const product = new Product(null, title, imageUrl, price, description)
  product.save()
  res.redirect('/')
}

// edit-product
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    res.redirect('/')
  }
  const prodId = req.params.productId

  Product.findById(prodId, product => {
    console.log(product)
    if (!product) {
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      path: '/admin/edit-product',
      pageTitle: 'Edit Product',
      editing: editMode,
      product: product,
    })
  })
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId

  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDescription = req.body.description

  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDescription
  )

  updatedProduct.save()
  res.redirect('/admin/products')
}

// products
exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      path: '/admin/products',
      pageTitle: 'Admin Products',
      hasProducts: products.length > 0,
    })
  })
}
