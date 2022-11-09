const { getDb } = require('../util/database')
const { ObjectId } = require('mongodb')

class User {
  constructor(username, email, cart, id) {
    this.name = username
    this.email = email
    this.cart = cart // {item: []}
    this._id = id
  }

  // Creating user
  save() {
    const db = getDb()

    return db
      .collection('users')
      .insertOne(this)
      .then(user => console.log(user))
      .catch(err => console.log(err))
  }

  // Add cart items to user's mongoDB database collection
  addToCart(product) {
    const db = getDb()
    // Find out if products is already exists in cart
    const cartProductIndex = this.cart.items.findIndex(
      p => p.productId.toString() === product._id.toString()
    )
    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]

    // Updated existing cart item's quantity OR add new cart item
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      // Storing only product's reference and quantity
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      })
    }

    const updatedCart = {
      items: updatedCartItems,
    }
    return db
      .collection('users')
      .updateOne({ _id: ObjectId(this._id) }, { $set: { cart: updatedCart } })
  }

  // user's cart
  getCart() {
    const db = getDb()
    const productsId = this.cart.items.map(p => p.productId)
    return (
      db
        .collection('products')
        // Get products which are added to cart by current user
        .find({ _id: { $in: productsId } })
        .toArray()
        .then(products => {
          // add quantities to products
          return products.map(product => {
            return {
              ...product,
              quantity: this.cart.items.find(
                p => p.productId.toString() === product._id.toString()
              ).quantity,
            }
          })
        })
    )
  }

  // Find user by id
  static findUserById(userId) {
    const db = getDb()

    return db
      .collection('users')
      .findOne({ _id: ObjectId(userId) })
      .catch(err => console.log(err))
  }
}

module.exports = User
