const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')

// router
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

app.set('view engine', 'pug')
app.set('views', 'views') // where to find

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes)
app.use(shopRoutes)

app.use((req, res, next) => {
  res.status(404).render('page-not-found')
})

app.listen(3000)
