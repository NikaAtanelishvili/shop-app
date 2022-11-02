const express = require('express')
const path = require('path')

const router = express.Router()
const adminData = require('./admin')

// get ( exact match )
router.get('/', (req, res, next) => {
  console.log(adminData.products)
  res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'))
})

module.exports = router
