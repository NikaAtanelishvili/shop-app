const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const { mongoConnect } = require('./util/database')
const User = require('./models/user')
const ObjectId = require('mongodb')

const app = express()

// Templating engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// Body parser
app.use(bodyParser.urlencoded({ extended: false }))

// CSS
app.use(express.static(path.join(__dirname, 'public')))

// User
app.use((req, res, next) => {
  User.findUserById('636a89efb216f5946fd03d75')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id)
      next()
    })
    .catch(err => console.log(err))
})

// Using routes
app.use(shopRoutes)
app.use('/admin', adminRoutes)
app.use(errorController.pageNotFound)

mongoConnect(() => app.listen(3000))
