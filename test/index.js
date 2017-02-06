import test from 'ava'
import Magnet from '../dist/'
import Base from '../dist/base'

class TestBase extends Base {}
let classes = {}

const testArray = [true, false, true, true]
testArray.forEach(function (truty, index) {
  classes[`class${index}`] = class extends Base {
    async setup () {
      this.app[`test${index}`] = truty
      this.app[`testSetupTime${index}`] = new Date().getTime()
    }
  }
})
classes.setupThrowError = class extends Base {
  async setup () {
    throw new Error('Throw error')
  }
}
classes.teardownThrowError = class extends Base {
  async setup () {}

  async teardown () {
    throw new Error('Throw error from teardown')
  }
}

test('Extend base', async function (t) {
  const testBase = new TestBase({})
  t.deepEqual(testBase.app, {})
  t.is(testBase.log, undefined)
  t.is(testBase.config, undefined)
})

test('Empty parameter', async function (t) {
  const error = await t.throws(Magnet(), TypeError)
  t.is(error.message, 'Modules should pass in as array')
})

test('Empty modules', async function (t) {
  const error = await t.throws(Magnet([]), Error)
  t.is(error.message, 'No modules provided')
})

test('Module add namespace', async function (t) {
  let singleModuleApp = await Magnet([classes.class0])
  t.true(singleModuleApp.test0)
})

test('Module inserted with params', async function (t) {
  let moduleWithParamsApp = await Magnet([{ module: classes.class0, options: {} }])
  t.true(moduleWithParamsApp.test0)
})

test('Module override', async function (t) {
  let overrideApp = await Magnet([classes.class0, class TestOverride extends Base {
    async setup () {
      this.app.test0 = false
    }
  }])
  t.false(overrideApp.test0)
})

test('Module load async', async function (t) {
  let asyncApp = await Magnet([
    classes.class0,
    [
      classes.class1,
      classes.class2
    ]
  ])
  t.true(asyncApp.test0)
  t.false(asyncApp.test1)
  t.true(asyncApp.test2)
})

test('Module load sequence setup', async function (t) {
  let sequenceApp = await Magnet([
    classes.class0,
    [
      classes.class1,
      classes.class2
    ],
    classes.class3
  ])

  t.true(sequenceApp.testSetupTime3 >= sequenceApp.testSetupTime2)
  t.true(sequenceApp.testSetupTime3 > sequenceApp.testSetupTime1)
  t.true(sequenceApp.testSetupTime3 > sequenceApp.testSetupTime0)
  t.true(sequenceApp.testSetupTime2 >= sequenceApp.testSetupTime0)
  t.true(sequenceApp.testSetupTime1 >= sequenceApp.testSetupTime0)
})

test('Module setup throw error', async function (t) {
  const error = await t.throws(Magnet([
    classes.setupThrowError
  ]), Error)

  t.is(error.message, 'Some modules cannot setup')
})

test('Module teardown throw error', async function (t) {
  const error = await t.throws(
    Magnet([ classes.teardownThrowError ])
    .then(function (app) {
      return app.magnet.shutdown()
    }),
    Error
  )

  t.is(error.message, 'Some modules cannot teardown')
})
