const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
})

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity,
    })
  }

  const updatedCart = {
    items: updatedCartItems,
  }

  this.cart = updatedCart
  return this.save()
}

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    item => item.productId.toString() !== productId.toString()
  )

  this.cart.items = updatedCartItems

  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}

module.exports = mongoose.model('User', userSchema)
