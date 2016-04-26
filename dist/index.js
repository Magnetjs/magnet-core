'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * We can change setup to be middleware based, but now let keep it simple with array only.
 */

exports.default = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
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

    var errorHandler = function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(err) {
        var closing, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, teardown;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                closing = [];
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 5;

                for (_iterator2 = teardowns[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  teardown = _step2.value;

                  closing.push(teardown());
                }
                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2['catch'](5);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 13:
                _context2.prev = 13;
                _context2.prev = 14;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 16:
                _context2.prev = 16;

                if (!_didIteratorError2) {
                  _context2.next = 19;
                  break;
                }

                throw _iteratorError2;

              case 19:
                return _context2.finish(16);

              case 20:
                return _context2.finish(13);

              case 21:
                _context2.next = 23;
                return Promise.all(closing);

              case 23:
                _context2.next = 28;
                break;

              case 25:
                _context2.prev = 25;
                _context2.t1 = _context2['catch'](0);

                consoleError(app, _context2.t1);

              case 28:
                _context2.prev = 28;

                consoleInfo(app, 'finally');
                process.kill(process.pid, 'SIGUSR2');
                return _context2.finish(28);

              case 32:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 25, 28, 32], [5, 9, 13, 21], [14,, 16, 20]]);
      }));

      return function errorHandler(_x4) {
        return ref.apply(this, arguments);
      };
    }();

    var modules = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    var app, starts, teardowns, consoleInfo, consoleError, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, start;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            consoleError = function consoleError(app, message) {
              if (app && app.log && app.log.error) {
                app.log.error(message);
              } else {
                console.error(app, message);
              }
            };

            consoleInfo = function consoleInfo(app, message) {
              if (app && app.log && app.log.info) {
                app.log.info(message);
              } else {
                console.log(message);
              }
            };

            app = {};
            starts = [];
            teardowns = [];


            process.once('uncaughtException', errorHandler);
            process.once('SIGUSR2', errorHandler);

            _context3.prev = 7;

            if (!modules.length) {
              _context3.next = 40;
              break;
            }

            _context3.next = 11;
            return performTasks(modules);

          case 11:
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context3.prev = 14;
            _iterator3 = starts.reverse()[Symbol.iterator]();

          case 16:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context3.next = 23;
              break;
            }

            start = _step3.value;
            _context3.next = 20;
            return start();

          case 20:
            _iteratorNormalCompletion3 = true;
            _context3.next = 16;
            break;

          case 23:
            _context3.next = 29;
            break;

          case 25:
            _context3.prev = 25;
            _context3.t0 = _context3['catch'](14);
            _didIteratorError3 = true;
            _iteratorError3 = _context3.t0;

          case 29:
            _context3.prev = 29;
            _context3.prev = 30;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 32:
            _context3.prev = 32;

            if (!_didIteratorError3) {
              _context3.next = 35;
              break;
            }

            throw _iteratorError3;

          case 35:
            return _context3.finish(32);

          case 36:
            return _context3.finish(29);

          case 37:

            consoleInfo(app, 'Ready');
            _context3.next = 41;
            break;

          case 40:
            consoleInfo(app, 'No modules provided.');

          case 41:
            return _context3.abrupt('return', app);

          case 44:
            _context3.prev = 44;
            _context3.t1 = _context3['catch'](7);

            consoleError(app, _context3.t1.stack);

          case 47:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[7, 44], [14, 25, 29, 37], [30,, 32, 36]]);
  }));

  function Magnet(_x) {
    return ref.apply(this, arguments);
  }

  return Magnet;
}();
//# sourceMappingURL=index.js.map