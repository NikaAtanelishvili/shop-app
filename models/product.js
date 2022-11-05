const fs = require('fs')
const path = require('path')

// data/products.json path
const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
)

// get all products
const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([])
    } else {
      cb(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    ;(this.title = title),
      (this.imageUrl = imageUrl),
      (this.description = description),
      (this.price = price)
    this.id = Math.random().toString()
  }

  save() {
    getProductsFromFile(products => {
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), err => {
        console.error(err)
      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }

  static findById(productId, callback) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === productId)
      callback(product)
    })
  }
}
