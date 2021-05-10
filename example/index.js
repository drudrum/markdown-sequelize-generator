const Sequelize = require('sequelize')
const sequelize = new Sequelize('sqlite://')
const gendoc = require('markdown-sequelize-generator')

const parent = sequelize.define('parent', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

const child = sequelize.define('child', {
  name: {
    type: Sequelize.STRING
  },
  birthday: {
    type: Sequelize.DATE,
    allowNull: true
  }
})

parent.hasMany(child)

const markdownDoc = gendoc(sequelize).auto().toString()

console.log(markdownDoc)
