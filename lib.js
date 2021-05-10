'use strict'
const _ = require('underscore')

const defaultSamples = {
  UUID: '413e8630-c16c-11e5-b8c9-9b7d37852114',
  BIGINT: 1,
  INTEGER: 1,
  ENUM: function (type) { return type.values.join(' | ') },
  STRING: 'string',
  DATE: '2015-12-31T23:59:59.123',
  TEXT: 'text'
}

function isAssocAnArray (associationType) {
  return associationType === 'HasMany' || associationType === 'BelongsToMany'
}

function create (sequelize, samples) {
  samples = _.extend(defaultSamples, samples)

  function printerMD () {
    let value = ''

    function print (/* vararg */) {
      const args = [].slice.call(arguments)
      value += '\n' + args.join(' ')
      return self
    }

    function header () {
      value = '\n'
      return self
    }

    function footer () {
      value += '\n'
      return self
    }

    const self = {
      print: print,
      header: header,
      footer: footer,
      value: function () { return value }
    }
    return self
  }

  function printerJS () {
    let value = ''

    function print (/* vararg */) {
      const args = [].slice.call(arguments)
      value += '\n * ' + args.join(' ')
      return self
    }

    function header () {
      value = '/**'
      return self
    }

    function footer () {
      value += '\n */\n'
      return self
    }

    const self = {
      print: print,
      header: header,
      footer: footer,
      value: function () { return value }
    }
    return self
  }

  function createObject (model, options) {
    options = options || {}
    let include = options.include
    const includeAll = !include
    const ignoredFields = options.ignoredFields || []
    const root = {}

    const stack = [{
      obj: root,
      model: model,
      include: include
    }]

    const previousModels = []

    while (stack.length) {
      const data = stack.pop()
      model = data.model

      const obj = data.obj

      include = data.include
      const association = data.association
      const associationName = data.associationName
      const parent = data.parent

      if (includeAll && previousModels.indexOf(model.name) >= 0) {
        const isArray = isAssocAnArray(association.associationType)
        parent[associationName] = isArray ? [{}] : {}
        continue
      }
      previousModels.push(model.name)

      _.each(model.rawAttributes, function (attr, attrName) {
        if (ignoredFields.indexOf(attrName) >= 0) return
        let sample = samples[attr.type.key]
        if (typeof sample === 'function') {
          sample = sample(attr.type)
        }
        obj[attrName] = sample
      })

      _.each(model.associations, function (association, associationName) {
        let newInclude
        let found = false
        if (include) {
          found = include.some(function (inc) {
            let model = inc.model
            model = sequelize.model(model)
            if (model === association.target) {
              newInclude = inc.include
              return true
            }
            return false
          })
        }
        if (!includeAll && !found) return

        stack.push({
          obj: {},
          parent: obj,
          include: newInclude,
          association: association,
          associationName: associationName,
          model: association.target
        })
      })

      if (parent && association && associationName) {
        const array = isAssocAnArray(association.associationType)
        parent[associationName] = array ? [obj] : obj
      }
    }

    return root
  }

  function _capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  function defineJsdoc (model) {
    const p = printerJS()
    p.header().print('@typedef {Object}', _capitalizeFirstLetter(model.name))
    _.each(model.rawAttributes, function (attr, attrName) {
      if (attr.allowNull) attrName = '[' + attrName + ']'
      const type = (attr.type.key || attr.type).toLowerCase()
      p.print(
        '@property', '{' + _capitalizeFirstLetter(type) + '}', attrName
      )
    })
    _.each(model.associations, function (association, associationName) {
      let _type = _capitalizeFirstLetter(association.target.name)
      const fkAttributes = association.target.rawAttributes[association.foreignKey]
      const allowNull = fkAttributes ? fkAttributes.allowNull : false
      if (isAssocAnArray(association.associationType)) {
        _type = 'Array.<' + _type + '>'
      } else if (allowNull) {
        associationName = '[' + associationName + ']'
      }
      p.print('@property', '{' + _type + '}', associationName)
    })

    return p.footer().value()
  }

  function defineDoc (model, type) {
    const p = printerMD().header().print('## Model:', model.name)
    _.each(model.rawAttributes, function (attr, attrName) {
      if (attr.allowNull) attrName = '*' + attrName + '*'
      const type = (attr.type.key || attr.type).toLowerCase()
      p.print(`* ${attrName}: ${type}`)
    })
    _.each(model.associations, function (association, associationName) {
      let _type = association.target.name
      const fkAttributes = association.target.rawAttributes[association.foreignKey]
      const allowNull = fkAttributes ? fkAttributes.allowNull : false
      const link = `model-${_type}`
      if (isAssocAnArray(association.associationType)) {
        _type += '[]'
      } else if (allowNull) {
        associationName = '[' + associationName + ']'
      }
      p.print(`* ${associationName}: [${_type}](#${link}).`)
    })

    return p.footer().value()
  }

  function defineExample (name, type, obj, isArray) {
    if (isArray) {
      obj = [obj]
      name += 'Array'
    }
    const p = printerMD().header().print('## Example of ', name + type)
    // var exampleType = exampleTypes[type];
    // p.print('@api ' + exampleType + ' Example {json}', type);
    p.print('```')
    const lines = JSON.stringify(obj, null, '  ').split('\n')
    lines.forEach(function (line) {
      p.print('    ' + line)
    })
    p.print('```')
    return p.footer().value()
  }

  function _docToString () {
    let string = ''
    _.each(this, function (value) {
      string += value + '\n'
    })
    return string
  }

  function defineAll (model, options) {
    const name = model.name
    const obj = createObject(model, options)

    const request = defineExample(name, '', obj, false)

    const proto = Object.create({ toString: _docToString })
    const doc = _.extend(proto, {
      param: defineDoc(model, 'Param'),
      request: request
    })

    return doc
  }

  function _allDocToString () {
    let string = ''
    _.each(this, function (docs) {
      string += docs.toString()
    })
    return string
  }

  function auto (options) {
    options = options || {}
    const results = {}
    _.each(sequelize.models, function (model) {
      results[model.name] = defineAll(model, options[model.name])
    })

    const proto = Object.create({ toString: _allDocToString })
    return _.extend(proto, results)
  }

  const self = {
    auto: auto,
    createObject: createObject,
    defineDoc: defineDoc,
    defineJsdoc: defineJsdoc,
    defineExample: defineExample,
    defineAll: defineAll
  }

  return self
}

module.exports = create
