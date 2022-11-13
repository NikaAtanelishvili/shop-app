const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const mongoose = require('mongoose')
const session = require('express-session')
const User = require('./models/user')
const MongoDBStorage = require('connect-mongodb-session')(session)
const csrf = require('csurf')

const MONGODB_URI =
  'mongodb+srv://Nika:ubTWvwgDtXgTSx2L@cluster0.wquqyac.mongodb.net/shop?retryWrites=true&w=majority'

const app = express()

const store = new MongoDBStorage({
  uri: MONGODB_URI,
  collection: 'sessions',
})

const csrfProtection = csrf()

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

// Session
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
)

// csrf
app.use(csrfProtection)

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  // to use mongoose methods we still use this middleware
  User.findById(req.session.user._id).then(user => {
    req.user = user
    next()
  })
})

app.use((req, res, next) => {
  // set local variables
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

// Using routes
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.pageNotFound)

mongoose
  .connect(MONGODB_URI)
  .then(() => app.listen(3000))
  .catch(err => console.log(err))
