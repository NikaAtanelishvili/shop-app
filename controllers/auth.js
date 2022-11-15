const bcrypt = require('bcryptjs')
// sending emails
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')

const User = require('../models/user')

// nodemailer setup
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        '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',
    },
  })
)

// login
exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  message = message.length > 0 ? message[0] : null

  console.log(message)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  })
}

exports.postLogin = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  // validate email
  const userDoc = await User.findOne({ email: email })

  if (!userDoc) {
    req.flash('error', 'Invalid email or password.')
    return res.redirect('/login')
  }

  // validate password
  const passwordMatch = await bcrypt.compare(password, userDoc.password)

  if (!passwordMatch) {
    req.flash('error', 'Invalid email or password.')
    return res.redirect('/login')
  }

  // create session
  req.session.isLoggedIn = true
  req.session.user = userDoc

  return res.redirect('/')
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

// sign up
exports.getSignup = (req, res, next) => {
  let message = req.flash('signupError')

  message = message.length > 0 ? message[0] : null
  console.log(message)
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  })
}

exports.postSignup = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  // const confirmPassword = req.body.confirmPassword ( soon )

  // if email is taken
  const userDoc = await User.findOne({ email: email })
  if (userDoc) {
    req.flash('signupError', 'This E-mail is already registered.')
    return res.redirect('/signup')
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = new User({
    email: email,
    password: hashedPassword,
    cart: { items: [] },
  })

  await user.save()

  await transporter
    .sendMail({
      to: email,
      from: 'atanelishvilinika@gmail.com',
      subject: 'Signup secceeded!',
      html: '<h1>You successfully signed up!</h1>',
    })
    .catch(err => console.log(err))

  res.redirect('/login')
}
