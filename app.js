const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const mongoose = require('mongoose')
const session = require('express-session')
const User = require('./models/user')
const MongoDBStorage = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

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

// Csrf
app.use(csrfProtection)

// Flash sessions
app.use(flash())

// Local variables
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

// User
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) return next()

    const user = await User.findById(req.session.user._id)

    if (!user) return next()

    req.user = user

    next()
  } catch (err) {
    next(new Error(err))
  }
})

// Routes
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.get('/500', errorController.get500)

app.use(errorController.pageNotFound)

// Error handling middleware
app.use((error, req, res, next) => {
  // This sends new request and causes infinite loop
  // res.status(error.httpStatusCode).render(...)
  // res.redirect('/500')

  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
  })
})

// App
mongoose
  .connect(MONGODB_URI)
  .then(() => app.listen(3000))
  .catch(err => console.log(err))
