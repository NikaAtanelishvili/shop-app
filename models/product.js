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

/* const { getDb } = require('../util/database')
const { ObjectId } = require('mongodb')

class Product {
  // Creating product
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id && new ObjectId(id)
    this.userId = userId
  }

  // Creating collection
  save() {
    const db = getDb()
    let dbOp

    // PURPOSE - For editing functionality
    // If product exists UPDATE existing object on mongoDB database
    // If product DOES NOT exists create new object on mongoDB database
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this })
    } else {
      dbOp = db.collection('products').insertOne(this)
    }

    return dbOp.then().catch(err => console.log(err))
  }

  // Fetching products
  static fetchAll() {
    const db = getDb()

    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => products)
      .catch(err => console.log(err))
  }

  // Find product by id
  static findById(id) {
    const db = getDb()

    return db
      .collection('products')
      .find({ _id: new ObjectId(id) })
      .next()
      .then(product => product)
      .catch(err => console.log(err))
  }

  // Delete product by id
  static deleteById(id) {
    const db = getDb()
    return db
      .collection('products')
      .deleteOne({ _id: new ObjectId(id) })
      .then()
      .catch(err => console.log(err))
  }
}

module.exports = Product
 */
