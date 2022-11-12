const express = require('express')

const router = express.Router()

const authController = require('../controllers/auth')

router.use('/login', authController.getLogin)

module.exports = router
