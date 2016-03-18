'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * We can change setup to be middleware based, but now let keep it simple with array only.
 */

exports.default = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var performTasks = function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(arr) {
        var Modules, setups, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, Module, task;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                Modules = arr.shift();


                if (!Array.isArray(Modules)) {
                  Modules = [Modules];
                }

                setups = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 6;
                _iterator = Modules[Symbol.iterator]();

              case 8:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 23;
                  break;
                }

                Module = _step.value;
                task = void 0;

                if (Module.module) {
                  task = new Module.module(app, Module.options);
                } else {
                  task = new Module(app);
                }

                if (!task.setup) {
                  _context.next = 18;
                  break;
                }

                _context.t0 = setups;
                _context.next = 16;
                return task.setup();

              case 16:
                _context.t1 = _context.sent;

                _context.t0.push.call(_context.t0, _context.t1);

              case 18:

                if (task.start) {
                  starts.push(task.start.bind(task));
                }

                if (task.teardown) {
                  teardowns.push(task.teardown.bind(task));
                }

              case 20:
                _iteratorNormalCompletion = true;
                _context.next = 8;
                break;

              case 23:
                _context.next = 29;
                break;

              case 25:
                _context.prev = 25;
                _context.t2 = _context['catch'](6);
                _didIteratorError = true;
                _iteratorError = _context.t2;

              case 29:
                _context.prev = 29;
                _context.prev = 30;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 32:
                _context.prev = 32;

                if (!_didIteratorError) {
                  _context.next = 35;
                  break;
                }

                throw _iteratorError;

              case 35:
                return _context.finish(32);

              case 36:
                return _context.finish(29);

              case 37:
                _context.next = 39;
                return setups;

              case 39:
                if (!arr.length) {
                  _context.next = 42;
                  break;
                }

                _context.next = 42;
                return performTasks(arr);

              case 42:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 25, 29, 37], [30,, 32, 36]]);
      }));

      return function performTasks(_x3) {
        return ref.apply(this, arguments);
      };
    }();

    var modules = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    var app, starts, teardowns, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, start;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            app = {};
            starts = [];
            teardowns = [];
            _context2.prev = 3;

            if (!modules.length) {
              _context2.next = 36;
              break;
            }

            _context2.next = 7;
            return performTasks(modules);

          case 7:
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 10;
            _iterator2 = starts.reverse()[Symbol.iterator]();

          case 12:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context2.next = 19;
              break;
            }

            start = _step2.value;
            _context2.next = 16;
            return start();

          case 16:
            _iteratorNormalCompletion2 = true;
            _context2.next = 12;
            break;

          case 19:
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2['catch'](10);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t0;

          case 25:
            _context2.prev = 25;
            _context2.prev = 26;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 28:
            _context2.prev = 28;

            if (!_didIteratorError2) {
              _context2.next = 31;
              break;
            }

            throw _iteratorError2;

          case 31:
            return _context2.finish(28);

          case 32:
            return _context2.finish(25);

          case 33:

            console.log('Ready');
            _context2.next = 37;
            break;

          case 36:
            console.log('No modules provided.');

          case 37:
            return _context2.abrupt('return', app);

          case 40:
            _context2.prev = 40;
            _context2.t1 = _context2['catch'](3);

            console.error(_context2.t1.stack);

          case 43:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[3, 40], [10, 21, 25, 33], [26,, 28, 32]]);
  }));

  function Magnet(_x) {
    return ref.apply(this, arguments);
  }

  return Magnet;
}();