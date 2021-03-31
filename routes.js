const express = require('express')
const { asyncHandler } = require('./middleware/async-handler')
const { authenticateUser } = require('./middleware/auth-user')
const User = require('./models').Users
const Course = require('./models').Courses

// Construct a router instance.
const router = express.Router()

/**
 * USER Routes
 */

// GET route that returns the current authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const currentUser = req.currentUser
  const user = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    where: {
      id: currentUser.id
    }
  })
  res.json({ user }

    // firstName: user.firstName,
    // lastName: user.lastName,
    // emailAddress: user.emailAddress
  )
}))

// POST route that creates a new user
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body)
    res.redirect(201, '/')
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message)
      res.status(400).json({ errors })
    } else {
      throw error
    }
  }
}))

/**
 * COURSES Routes
 */

// GET route that returns a list of all courses
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: User
    }
  })
  res.json({ courses })
}))

// GET route that returns a single course
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findAll({
    attributes: {exclude: ['createdAt', 'updatedAt']},
    where: {
      id: parseInt(req.params.id)
    },
    include: {
      model: User
    },
    
  })
  if (course) {
    res.json({ course })
  } else {
    res.status(400)
      .json({ msg: `No course found with an id of ${req.params.id}` })
  }
}))

// POST route that creates a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser
  if (user) {
    try {
      const newCourse = await Course.create(req.body)
      const lastCourse = await Course.findOne({
        where: {
          title: newCourse.title,
          description: newCourse.description
        }
      })
      res.redirect(201, '/courses/' + lastCourse.id)
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message)
        res.status(400).json({ errors })
      } else {
        throw error
      }
    }
  }
}))

// PUT route that updates a course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser
  const found = await Course.findByPk(req.params.id)

  if (found && found.userId === user.id) {
    await found.update({
      title: req.body.title,
      description: req.body.description,
      userId: user.id
    }, { fields: ['title', 'description', 'userId'] })
    res.status(204).end()
  } else {
    res.status(403).json({ msg: 'Access denied' })
  }
}))

// DELETE route that deletes a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser
  const found = await Course.findByPk(req.params.id)

  if (found && found.userId === user.id) {
    await Course.destroy({
      where: {
        id: parseInt(req.params.id)
      }
    })
    res.status(204).end()
  } else {
    res.status(403).json({ msg: 'Access denied' })
  }
}))

module.exports = router
