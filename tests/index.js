import test from 'tape';
import Magnet from '../src/';
import Base from '../src/base';

(async function () {
try {
  class TestBase extends Base {}
  let classes = {};
  [true, false, true, true].forEach(function (truty, index) {
    classes[`class${index}`] = class extends Base {
      async setup() {
        this.app[`test${index}`] = truty;
        this.app[`testSetupTime${index}`] = new Date().getTime();
      }

      async start() {
        this.app[`testStartTime${index}`] = new Date().getTime();
      }
    }
  });

  const [
    emptyApp, singleModuleApp, overrideApp, asyncApp, sequenceApp
  ] = await Promise.all([
    Magnet(),
    Magnet([classes.class0]),
    Magnet([classes.class0, class TestOverride extends Base {
      async setup() {
        this.app.test0 = false;
      }
    }]),
    Magnet([
      classes.class0,
      [
        classes.class1,
        classes.class2
      ]
    ]),
    Magnet([
      classes.class0,
      [
        classes.class1,
        classes.class2
      ],
      classes.class3
    ])
  ]);

  test('Extend base', function (t) {
    const testBase = new TestBase({});

    t.deepEqual(testBase.app , {});
    t.equal(testBase.log , undefined);
    t.equal(testBase.config , undefined);
    t.end();
  });

  test('Empty modules', function (t) {
    t.deepEqual(emptyApp, {});
    t.end();
  });

  test('Module add namespace', function (t) {
    t.true(singleModuleApp.test0);
    t.end();
  });

  test('Module override', function (t) {
    t.false(overrideApp.test0);
    t.end();
  });

  test('Module load async', function (t) {
    t.true(asyncApp.test0);
    t.false(asyncApp.test1);
    t.true(asyncApp.test2);
    t.end();
  });

  test('Module load sequence setup', function (t) {
    t.true(sequenceApp.testSetupTime3 >= sequenceApp.testSetupTime2);
    t.true(sequenceApp.testSetupTime3 > sequenceApp.testSetupTime1);
    t.true(sequenceApp.testSetupTime3 > sequenceApp.testSetupTime0);
    t.true(sequenceApp.testSetupTime2 >= sequenceApp.testSetupTime0);
    t.true(sequenceApp.testSetupTime1 >= sequenceApp.testSetupTime0);
    t.end();
  });
} catch (err) {
  console.error(err);
}
})();
