const { MongoClient } = require('mongodb')

let _db

// Url for connecting mongodb database
const url =
  'mongodb+srv://Nika:ubTWvwgDtXgTSx2L@cluster0.wquqyac.mongodb.net/shop?retryWrites=true&w=majority'

const mongoConnect = callback => {
  MongoClient.connect(url)
    .then(client => {
      _db = client.db()
      callback()
    })
    .catch(err => {
      console.log(err)
      throw err()
    })
}

const getDb = () => {
  if (_db) return _db
}

exports.getDb = getDb
exports.mongoConnect = mongoConnect
