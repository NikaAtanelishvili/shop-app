const { OrderedBulkOperation } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },

  products: [
    {
      product: { type: Object, required: true },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
})

module.exports = mongoose.model('Order', OrderSchema)
