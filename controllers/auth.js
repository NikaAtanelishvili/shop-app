const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')

const User = require('../models/user')
const SENDGRID_API_KEY = require('../config/config')
const SENDER_EMAIL = require('../config/config')

// nodemailer setup
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: SENDGRID_API_KEY,
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
  let message = req.flash('error')

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
    req.flash('error', 'This E-mail is already registered.')
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
      from: SENDER_EMAIL,
      subject: 'Signup secceeded!',
      html: '<h1>You successfully signed up!</h1>',
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))

  res.redirect('/login')
}

// reset password

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  message = message.length > 0 ? message[0] : null

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  })
}

exports.postReset = (req, res, next) => {
  console.log(SENDER_EMAIL, SENDGRID_API_KEY)
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      req.flash('error', 'No account with that email found.')
      return res.redirect('/reset')
    }
    user.resetToken = token
    user.resetTokenExpiration = Date.now() + 3600000

    await user.save()

    console.log(req.body.email)

    transporter
      .sendMail({
        to: req.body.email,
        from: SENDER_EMAIL,
        subject: 'Password reset',
        html: `
      <p>You requested a password reset</p>
      <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
      `,
      })
      .catch(err => console.log(err))
    return res.redirect('/')
  })
}
