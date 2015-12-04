'use strict';

var case_ = exports;

var expect = require('chai').expect;

case_.title = function (c) {
  return c.description || c.d;
};


case_.args = function (c) {
  return c.args || c.a;
};


case_.run = function (c) {
  return c.run || r;
};


case_.expect = function (c) {
  return c.expect || c.e;
};


case_.error = function (c) {
  return c.error || c.err;
};

case_.equal = function (actual, expected) {
  if (Object(expected) === expected) {
    expect(actual).to.deep.equal(expected);
    return;
  }
console.log(arguments)
  expect(actual).to.equal(expected);
};