const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const mongoose = require('mongoose')
const User = require('./models/user')

const app = express()

// Templating engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

// Body parser
app.use(bodyParser.urlencoded({ extended: false }))

// CSS
app.use(express.static(path.join(__dirname, 'public')))

// User
app.use((req, res, next) => {
  User.findById('636d3b31d4a1e00e10365723')
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

// Using routes
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.pageNotFound)

mongoose
  .connect(
    'mongodb+srv://Nika:ubTWvwgDtXgTSx2L@cluster0.wquqyac.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then(() => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Nika',
          email: 'nika@test.com',
          cart: {
            items: [],
          },
        })

        user.save()
      }
    })

    app.listen(3000)
  })
  .catch(err => console.log(err))
