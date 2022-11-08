const { getDb } = require('../util/database')
const { ObjectId } = require('mongodb')

class User {
  constructor(username, email) {
    this.name = username
    this.email = email
  }

  save() {
    const db = getDb()

    return db
      .collection('users')
      .insertOne(this)
      .then(user => console.log(user))
      .catch(err => console.log(err))
  }

  static findUserById(userId) {
    const db = getDb()

    return db
      .collection('users')
      .findOne({ _id: ObjectId(userId) })
      .catch(err => console.log(err))
  }
}

module.exports = User
