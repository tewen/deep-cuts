const _ = require('lodash');

function chooseKey({ parentKey, k, isArray }) {
  if (parentKey) {
    const key = chooseKey({
      k,
      isArray
    });
    return `${parentKey}${isArray ? key : `.${key}`}`;
  }
  return isArray ? `[${k}]` : k;
}

function recursiveFlatten(obj, parentKey = '') {
  if (_.isObject(obj)) {
    const isArray = _.isArray(obj);
    return _.reduce(obj, (acc, v, k) => {
      const key = chooseKey({
        parentKey,
        k,
        isArray
      });
      if (_.isObject(v)) {
        return _.merge(acc, recursiveFlatten(v, key));
      }
      acc[key] = v;
      return acc;
    }, {});
  }
  return obj;
}

function flattenObject(obj) {
  return recursiveFlatten(obj);
}

module.exports = {
  flattenObject
};
