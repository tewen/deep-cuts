const _ = require('lodash');

function acceptNoArguments(fn, ...args) {
  return _.ary(_.partial(fn, ...args), 0);
}

module.exports = {
  acceptNoArguments
};
