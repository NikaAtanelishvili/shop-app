const { getDb } = require('../util/database')
const { ObjectId } = require('mongodb')

class Product {
  // Creating product
  constructor(title, price, description, imageUrl) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
  }

  // Creating collection
  save() {
    const db = getDb()

    return db
      .collection('products')
      .insertOne(this)
      .then(res => console.log(res))
      .catch(err => console.log(err))
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
}

module.exports = Product
