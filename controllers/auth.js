const bcrypt = require('bcryptjs')

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
  const email = req.body.email
  const password = req.body.password

  ;(async () => {
    // validate email
    const userDoc = await User.findOne({ email: email })

    if (!userDoc) return res.redirect('/login')

    // validate password
    const passwordMatch = await bcrypt.compare(password, userDoc.password)

    if (!passwordMatch) return res.redirect('/login')

    // create session
    req.session.isLoggedIn = true
    req.session.user = userDoc

    return res.redirect('/')
  })()
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

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  ;(async () => {
    // if email is taken
    const userDoc = await User.findOne({ email: email })
    if (userDoc) return res.redirect('/signup')

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    })

    await user.save()

    res.redirect('/login')
  })()
}
