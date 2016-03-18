"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function Base() {
  var app = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  _classCallCheck(this, Base);

  this.app = app;
  this.log = app.log;
  this.config = app.config;
  this.options = options;
};

exports.default = Base;