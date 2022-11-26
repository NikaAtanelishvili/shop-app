const path = require('path')
const fs = require('fs')
const https = require('https')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const mongoose = require('mongoose')
const session = require('express-session')
const User = require('./models/user')
const MongoDBStorage = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.wquqyac.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`

const app = express()

const store = new MongoDBStorage({
  uri: MONGODB_URI,
  collection: 'sessions',
})

const csrfProtection = csrf()

// const privateKey = fs.readFileSync('server.key')
// const certificate = fs.readFileSync('server.cert')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}_${file.originalname}`)
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// Templating engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

// loggin file setup
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)

// secure headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", 'js.stripe.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      'frame-src': ["'self'", 'js.stripe.com'],
      'font-src': ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
    },
  })
)
// compressing assets
app.use(compression())

app.use(morgan('combined', { stream: accessLogStream }))

// Body parser ( Parses strings )
app.use(bodyParser.urlencoded({ extended: false }))

// Multer ( Pasrses files )
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
)

// Serve Public & Images
app.use(express.static(path.join(__dirname, 'public')))
/** Why '/images'
 * This points folder and serve files as if they were on the root.
 * but we want to keep them in the images folder.
 */
app.use('/images', express.static(path.join(__dirname, 'images')))

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
  .then(() =>
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000)
    app.listen(process.env.PORT || 3000)
  )
  .catch(err => console.log(err))
