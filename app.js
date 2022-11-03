const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

// templating engines
app.set('view engine', 'ejs')
app.set('views', 'views') // where to find

app.use(bodyParser.urlencoded({ extended: false }))

// connect css
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/admin', adminRoutes)
app.use(shopRoutes)

// page not found page
app.use((req, res, next) => {
  res
    .status(404)
    .render('page-not-found', { pageTitle: 'Page not found', path: null })
})

app.listen(3000)
