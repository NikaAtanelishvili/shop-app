const mongoose = require('mongoose')
const Schema = mongoose.Schema

// creating new schema
const productSchema = new Schema({
  // How product object looks like
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    // relation
    ref: 'User',
    required: true,
  },
})

module.exports = mongoose.model('Product', productSchema)
