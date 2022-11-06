const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const error = require('./controllers/error')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))

// connect css
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/admin', adminRoutes)
app.use(shopRoutes)

// page not found page
app.use(error.pageNotFound)

app.listen(3000)
