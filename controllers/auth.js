const User = require('../models/user')

// login
exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  })
}

exports.postLogin = (req, res, next) => {
  User.findById('636d3b31d4a1e00e10365723').then(user => {
    req.session.isLoggedIn = true
    req.session.user = user

    // runs when sessions are created
    req.session.save(() => {
      res.redirect('/')
    })
  })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

// sign up
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  })
}

exports.postSignup = (req, res, next) => {}
