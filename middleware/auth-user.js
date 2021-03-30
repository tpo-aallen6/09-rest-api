const auth = require('basic-auth')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
  const credentials = auth(req)
  let message

  if (credentials) {
    const user = await User.findOne({
      where: {
        username: credentials.name
      }
    })

    if (user) {
      const authenticated = bcrypt
        .compareSync(credentials.pass, user.confirmedPassword)

      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`)
        req.currentUser = user
      } else {
        message = `Authentication failure for username: ${user.username}`
      }
    } else {
      message = `User not found for username: ${credentials.name}`
    }
  } else {
    message = 'Auth header not found'
  }

  if (message) {
    console.warn(message)
    res.status(401).json({
      msg: 'Access Denied'
    })
  } else {
    next()
  }
}
