'use strict'
const Sequelize = require('sequelize')
const expect = require('chai').expect
const fs = require('fs')
const lib = require('../lib.js')
const path = require('path')

function createSequelize () {
  const sequelize = new Sequelize('sqlite://')

  fs.readdirSync(path.join(__dirname, 'models'))
    .filter(function (file) { return file.endsWith('.js') })
    .forEach(function (file) {
      require(path.join(__dirname, 'models', file))(sequelize, Sequelize)
    })

  const parent = sequelize.models.parent
  const parentDetails = sequelize.models.parentDetails
  const child = sequelize.models.child
  const grandchild = sequelize.models.grandchild

  parent.hasOne(parentDetails)
  parent.hasMany(child)
  child.hasMany(grandchild)

  grandchild.belongsTo(parent)

  return sequelize
}

let sequelize
beforeEach(function () {
  sequelize = createSequelize()
})

describe('createObject()', function () {
  it('should recreate an object tree from sequelize model', function () {
    const obj = lib(sequelize).createObject(sequelize.models.parent)

    expect(obj).to.eql({
      id: 1,
      uuid: '413e8630-c16c-11e5-b8c9-9b7d37852114',
      name: 'string',
      count: 1,
      category: 'CAT1 | CAT2',
      birthday: '2015-12-31T23:59:59.123',
      createdAt: '2015-12-31T23:59:59.123',
      updatedAt: '2015-12-31T23:59:59.123',
      parentDetailsId: 1,
      children: [{
        id: 1,
        name: 'string',
        createdAt: '2015-12-31T23:59:59.123',
        updatedAt: '2015-12-31T23:59:59.123',
        parentId: 1,
        grandchildren: [{
          childId: 1,
          createdAt: '2015-12-31T23:59:59.123',
          grandParentId: 1,
          id: 1,
          name: 'string',
          parent: {}, // preventing cyclic loops
          parentId: 1,
          updatedAt: '2015-12-31T23:59:59.123'
        }]
      }],
      parentDetail: {
        id: 1,
        address: 'string',
        createdAt: '2015-12-31T23:59:59.123',
        updatedAt: '2015-12-31T23:59:59.123',
        parentId: 1
      }
    })
  })

  it('should recreate an object with only specified includes', function () {
    const obj = lib(sequelize).createObject(sequelize.models.parent, {
      ignoredFields: ['createdAt'],
      include: [{
        model: 'child'
      }, {
        model: 'parentDetails'
      }]
    })

    expect(obj).to.eql({
      id: 1,
      uuid: '413e8630-c16c-11e5-b8c9-9b7d37852114',
      name: 'string',
      count: 1,
      category: 'CAT1 | CAT2',
      birthday: '2015-12-31T23:59:59.123',
      updatedAt: '2015-12-31T23:59:59.123',
      parentDetailsId: 1,
      children: [{
        id: 1,
        name: 'string',
        updatedAt: '2015-12-31T23:59:59.123',
        parentId: 1
      }],
      parentDetail: {
        id: 1,
        address: 'string',
        updatedAt: '2015-12-31T23:59:59.123',
        parentId: 1
      }
    })
  })

  it('should recreate an object with only specified includes', function () {
    const obj = lib(sequelize).createObject(sequelize.models.parent, {
      ignoredFields: ['createdAt', 'updatedAt'],
      include: [{
        model: 'child',
        include: [{
          model: 'grandchild'
        }]
      }]
    })

    expect(obj).to.eql({
      id: 1,
      uuid: '413e8630-c16c-11e5-b8c9-9b7d37852114',
      name: 'string',
      count: 1,
      category: 'CAT1 | CAT2',
      birthday: '2015-12-31T23:59:59.123',
      parentDetailsId: 1,
      children: [{
        id: 1,
        name: 'string',
        parentId: 1,
        grandchildren: [{
          childId: 1,
          grandParentId: 1,
          id: 1,
          name: 'string',
          parentId: 1
        }]
      }]
    })
  })
})

describe('defineDoc()', function () {
  it('should create head and props list', function () {
    const doc = lib(sequelize).defineDoc(sequelize.models.parent, 'Param')
    expect(doc).to.equal(
      '\n\n## Model: parent\n' +
      '* id: bigint\n' +
      '* uuid: uuid\n' +
      '* name: string\n' +
      '* *count*: integer\n' +
      '* category: enum\n' +
      '* birthday: date\n' +
      '* createdAt: date\n' +
      '* updatedAt: date\n' +
      '* *parentDetailsId*: bigint\n' +
      '* [parentDetail]: [parentDetails](#model-parentDetails).\n' +
      '* children: [child[]](#model-child).\n'
    )
  })
})

describe('defineJsdoc()', function () {
  it('should create @typedef with multple @property defs', function () {
    const doc = lib(sequelize).defineJsdoc(sequelize.models.parent)
    expect(doc).to.equal(
      '/**\n' +
      ' * @typedef {Object} Parent\n' +
      ' * @property {Bigint} id\n' +
      ' * @property {Uuid} uuid\n' +
      ' * @property {String} name\n' +
      ' * @property {Integer} [count]\n' +
      ' * @property {Enum} category\n' +
      ' * @property {Date} birthday\n' +
      ' * @property {Date} createdAt\n' +
      ' * @property {Date} updatedAt\n' +
      ' * @property {Bigint} [parentDetailsId]\n' +
      ' * @property {ParentDetails} [parentDetail]\n' +
      ' * @property {Array.<Child>} children\n' +
      ' */\n'
    )
  })
})

describe('defineExample()', function () {
  it('should create example doc', function () {
    const doc = lib(sequelize).defineExample('myObj', 'Response', {
      id: 1,
      name: 'string'
    })

    expect(doc).to.equal(
      '\n\n' +
      '## Example of  myObjResponse\n' +
      '```\n' +
      '    {\n' +
      '      "id": 1,\n' +
      '      "name": "string"\n' +
      '    }\n' +
      '```\n'
    )
  })

  it('should create example doc with an array', function () {
    const doc = lib(sequelize).defineExample('myObj', 'Request', {
      id: 1,
      name: 'string'
    }, true)

    expect(doc).to.equal(
      '\n\n' +
      '## Example of  myObjArrayRequest\n' +
      '```\n' +
      '    [\n' +
      '      {\n' +
      '        "id": 1,\n' +
      '        "name": "string"\n' +
      '      }\n' +
      '    ]\n' +
      '```\n'
    )
  })
})

function read (file) {
  const filename = path.join(__dirname, file)
  return fs.readFileSync(filename, 'utf8')
}
/* function write(file, what) {
  var filename = path.join(__dirname, file);
  return fs.writeFileSync(filename, what);
} */
describe('defineAll()', function () {
  it('should define all types of exampels for a specific model', function () {
    const examples = lib(sequelize).defineAll(sequelize.models.parent)

    const param = read('samples/param.md')
    const request = read('samples/request.md')

    expect(examples.param).to.equal(param)
    expect(examples.request).to.equal(request)

    expect(examples.toString()).to.be.a('string')
  })
})

describe('auto()', function () {
  it('should automatically generate docs for all models', function () {
    const docs = lib(sequelize).auto()

    expect(docs.toString()).to.equal(read('samples/auto.md'))
  })
  it('should respect includes', function () {
    const docs = lib(sequelize).auto({
      parent: {
        include: [{
          model: 'parentDetails'
        }]
      }
    })
    expect(docs.toString()).to.equal(read('samples/autoWithOptions.md'))
  })
})
