const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Courses extends Model {}

  Courses.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required'
        },
        notEmpty: {
          msg: 'Please provide a title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A description is required'
        },
        notEmpty: {
          msg: 'Please provide a description'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING
    },
    materialsNeeded: {
      type: DataTypes.STRING
    }
  },
  Courses.associate = (models) => {
    Courses.belongsTo(models.Users, {
      foreignKey: 'userId'
    })
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    sequelize
  })

  return Courses
}
