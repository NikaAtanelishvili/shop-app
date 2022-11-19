const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator')

const User = require('../models/user')
const SENDGRID_API_KEY = require('../config')

// Nodemailer setup
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: SENDGRID_API_KEY,
    },
  })
)

/** Log In
 * @get
 * Render Log in page.
 */
exports.getLogin = (req, res, next) => {
  let message = req.flash('loginError')
  message = message.length > 0 ? message[0] : null

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  })
}

/** Log In
 * @post
 * @async
 * Getting User inputs.
 * Validate User inputs.
 * Create Sessions.
 */
exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: errors.array(),
      })
    }

    // validate email
    const userDoc = await User.findOne({ email: email })

    if (!userDoc) {
      req.flash('loginError', 'Invalid email or password.')
      return res.redirect('/login')
    }

    // validate password
    const passwordMatch = await bcrypt.compare(password, userDoc.password)

    if (!passwordMatch) {
      req.flash('loginError', 'Invalid email or password.')
      return res.redirect('/login')
    }

    // create session
    req.session.isLoggedIn = true
    req.session.user = userDoc

    return req.session.save(() => {
      return res.redirect('/')
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

/** Log out
 * @post
 * Log out from account
 * Delete session.
 */
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

/** Sign Up
 * @get
 * Rendeting Sign up Page
 */
exports.getSignup = (req, res, next) => {
  let message = req.flash('signupError')

  message = message.length > 0 ? message[0] : null

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  })
}

/** Sign Up
 * @post
 * @async
 * Get User Inputs.
 * Validate User Inputs.
 * Hash Password.
 * Create User.
 * Send E-mail to User.
 */
exports.postSignup = async (req, res, next) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        },
        validationErrors: errors.array(),
      })
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
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

/** Change Password
 * @get
 * Rendering Change Password Page
 */
exports.getReset = (req, res, next) => {
  let message = req.flash('resetPasswordError')
  message = message.length > 0 ? message[0] : null

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  })
}

/** Change Password
 * @post
 * @async
 * Create Token for Reseting Password.
 * Assign User Token and Expiration Time.
 * Sending Confirmation E-mail to User.
 */
exports.postReset = (req, res, next) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err)
        return res.redirect('/reset')
      }

      const token = buffer.toString('hex')
      const user = await User.findOne({ email: req.body.email })

      if (!user) {
        req.flash('resetPasswordError', 'No account with that email found.')
        return res.redirect('/reset')
      }
      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 3600000

      await user.save()

      transporter
        .sendMail({
          to: req.body.email,
          from: 'atanelishvilinika@gmail.com',
          subject: 'Password reset',
          html: `
      <p>You requested a password reset</p>
      <p>Click this <a href="http://localhost:3000/new-password/${token}">link</a> to set a new password.</p>
      `,
        })
        .catch(err => console.log(err))
      return res.redirect('/')
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

/** Change Password
 * @get
 * @async
 * Validate Token.
 * Rendering New password Page.
 */
exports.getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token
    // $gt greater then ...
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    }).catch(err => console.log(err))

    let message = req.flash('newPasswordError')
    message = message.length > 0 ? message[0] : null

    res.render('auth/new-password', {
      path: '/new password',
      pageTitle: 'New password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    })
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}

/** Change Password
 * @post
 * @async
 * Getting NewPassword, UserId, Token.
 * Changing User's Password.
 * Updating Database
 */
exports.postNewPassword = async (req, res, next) => {
  try {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken

    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    })

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    user.password = hashedPassword
    user.resetToken = null
    user.resetTokenExpiration = null

    await user.save()

    return res.redirect('/login')
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }
}
