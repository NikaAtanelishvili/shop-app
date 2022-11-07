const { getDb } = require('../util/database')

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
  }

  save() {
    const db = getDb()

    // Creating collection
    return db
      .collection('products')
      .insertOne(this)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  static fetchAll() {
    const db = getDb()

    // Fetching products
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products)
        return products
      })
      .catch(err => console.log(err))
  }
}

module.exports = Product
