const Product = require('../models/product')

/** Add Product
 * @get
 * Rendering Add Product page
 */
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
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

/** Admin Products
 * @get
 * Render Admin products
 */
exports.getAdminProducts = async (req, res, next) => {
  const products = await Product.find({ userId: req.user._id })

  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
  })
}

/** Edit Products
 * @get
 * @async
 * Finding target product.
 * Rendering edit product page.
 */
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

/** Edit Products
 * @post
 * @async
 * Getting product data inputs.
 * Finding product.
 * Validate user.
 * Updating product data
 */
exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDesc = req.body.description

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
}

/** Delete Product
 * @post
 * @async
 * Find target product.
 * Delete product.
 */
exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId

  await Product.deleteOne({ _id: prodId, userId: req.user._id })
  res.redirect('/admin/products')
}
