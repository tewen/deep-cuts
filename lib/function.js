const _ = require('lodash');

function acceptNoArguments(fn, ...args) {
  return _.ary(_.partial(fn, ...args), 0);
}

function functionOrValue(fnOrValue, ...args) {
  return _.isFunction(fnOrValue) ? functionOrValue(fnOrValue(...args), ...args) : fnOrValue;
}

module.exports = {
  acceptNoArguments,
  functionOrValue
};
