const Product = require('../models/product')

// add-products [get]
exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  })
}
// add-products [POST]
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description

  const product = new Product(title, imageUrl, price, description)
  product.save()
  res.redirect('/')
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
