const _ = require('lodash');

function acceptNoArguments(fn, ...args) {
  return _.ary(_.partial(fn, ...args), 0);
}

function functionOrValue(fnOrValue, ...args) {
  return _.isFunction(fnOrValue) ? functionOrValue(fnOrValue(...args), ...args) : fnOrValue;
}

async function tryCatch(tryFn, catchFn) {
  try {
    return { response: await tryFn() };
  } catch (e) {
    return { error: _.isFunction(catchFn) ? await catchFn(e) : e };
  }
}

module.exports = {
  acceptNoArguments,
  functionOrValue,
  tryCatch
};
