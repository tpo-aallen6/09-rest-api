const express = require('express')
const { asyncHandler } = require('./middleware/async-handler')
// const { authenticateUser } = require('./middleware/auth-user')
const User = require('./models').Users
const Course = require('./models').Courses

// Construct a router instance.
const router = express.Router()

// GET route that returns a list of users
//  authenticateUser, ('/users', authenticateUser, asyncHandler(...))
router.get('/users', asyncHandler(async (req, res) => {
  // const user = req.currentUser
  // res.json({
  //   name: user.firstName,
  //   email: user.emailAddress
  // })
  const users = await User.findAll()
  res.json({ users })
}))

// POST route that creates a new user
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body)
    res.status(201).json({ "message": "Account successfully created!" })
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message)
      res.status(400).json({ errors })
    } else {
      throw error
    }
  }
}))

// GET route that returns a list of all courses
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll()
  res.json({ courses })
}))

module.exports = router
