const express = require('express')
const { asyncHandler } = require('./middleware/async-handler')
const { authenticateUser } = require('./middleware/auth-user')
const User = require('./models').Users
const Course = require('./models').Courses

// Construct a router instance.
const router = express.Router()

// GET route that returns the current authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  })
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
  const courses = await Course.findAll({
    include: {
      model: User
    }
  })
  res.json({ courses })
}))

// GET route that returns a single course
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    where: {
      id: parseInt(req.params.id)
    },
    include: {
      model: User
    }
  })
  if (course) {
    res.json({ course })
  } else {
    res.status(400)
      .json({ msg: `No course found with an id of ${req.params.id}` })
  }
}))

// POST route that creates a new course
router.post('/courses', asyncHandler(async (req, res) => {
  try {
    await Course.create(req.body)
    res.status(201).end()
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message)
      res.status(400).json({ errors })
    } else {
      throw error
    }
  }
}))

module.exports = router
