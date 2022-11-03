const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')

// routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// controller
const error = require('./controllers/error')

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
app.use(error.pageNotFound)

app.listen(3000)
