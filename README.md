# markdown-sequelize-generator

[![Build Status](https://travis-ci.org/drudrum/markdown-sequelize-generator.svg?branch=master)](https://travis-ci.org/drudrum/mardown-sequelize-generator)

Automatically generate markdown from
sequelize models.

This is a fork of [apidoc-sequelize-generator](https://github.com/jeremija/apidoc-sequelize-generator)

# installation

```bash
npm install markdown-sequelize-generator
```

# usage

## quick example

Here is a full example along with sequelize model definitions generating the
markdown document:

```javascript
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

```

This code is located in [example](example) directory.

## description of other methods

If you already have sequelize model definitions and wish to automatically
generate documentation of it's models, you can do so easily:

```javascript
var docgen = require('apidoc-sequelize-generator');
var sequelize = require('./path/to/my/sequelize/instance.js');

/*
 * automatically generate documentation for all model definitions
 */
var docs = docgen(sequelize).auto();
console.log(docs.toString());

/*
 * only include the child association for myModel
 */
docs = docgen(sequelize).auto({
  myModel: {
    include: [{
      model: 'child'
    }]
  }
});
// all model definitions, but myModel will only contain the child association
console.log(docs.toString());


/*
 * add custom samples for certain type definitions
 */
docs = docgen(sequelize, {
  DATE: '2015-12-31 23:59:59'
}).auto();
console.log(docs.toString())


/*
 * create a sample object
 */
var object = docgen(sequelize).createObject(sequelize.models.myModel);
console.log(object);

/*
 * create a params definition for object
 */
object = docgen(sequelize).defineDoc(sequelize.models.myModel, 'Param');
console.log(object);

/*
 *create all definitions for object
 */
docs = docgen(sequelize).defineAll(sequelize.models.myModel, 'Param');
console.log(docs.toString());

```

See examples of generated documents [here](test/samples).

See more details in the [test cases](test/lib-test.js).

# contributing

Pull requests are welcome. Just make sure all eslint rules pass and the tests
pass, and that the coverage is high enough. You can check that with:

```
npm run lint
npm test
npm run coverage
```

# license

MIT

