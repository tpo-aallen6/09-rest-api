const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = (sequelize) => {
  class Users extends Model {}

  Users.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required'
        },
        notEmpty: {
          msg: 'Please provide a first name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'That email address already exists'
      },
      validate: {
        notNull: {
          msg: 'An email address is required'
        },
        isEmail: {
          msg: 'Please provide a valid email address'
        }
      }
    },
    unsavedPassword: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        // len: {
        //   args: [8, 20],
        //   msg: 'The password should be between 8 and 20 characters in length'
        // }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set (val) {
        if (val === this.unsavedPassword) {
          const hashedPassword = bcrypt.hashSync(val)
          this.setDataValue('password', hashedPassword)
        }
      },
      validate: {
        notNull: {
          msg: 'Both passwords must match'
        }
      }
    }
  }, { sequelize })

  Users.associate = (models) => {
    Users.hasMany(models.Courses)
  }

  return Users
}
