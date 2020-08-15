const definedValues = (obj) => obj ? Object.keys(obj).reduce((acc, key) => {
  if (obj[key] !== undefined) {
    acc[key] = obj[key];
  }
  return acc;
}, {}) : {};

const isObject = (val) => val !== null && typeof val === 'object';

const isNonArrayObject = (val) => isObject(val) && !Array.isArray(val);

const isEmpty = (val) => (
  (!val && val !== false && val !== 0) || (isNonArrayObject(val) && !Object.keys(val).length) || (Array.isArray(val) && !val.length) || (typeof val === 'string' && val.trim() === '')
);

function recursiveMerge(a, b) {
  const definedA = definedValues(a);
  const definedB = definedValues(b);
  const merged = {
    ...definedA,
    ...definedB
  };
  Object.keys(definedA).forEach((key) => {
    if (isNonArrayObject(definedA[key]) && isNonArrayObject(definedB[key])) {
      merged[key] = recursiveMerge(definedA[key], definedB[key]);
    }
  });
  return merged;
}

const merge = (...args) => args.reduce((acc, obj) => recursiveMerge(acc, obj), {});

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

function recursiveFlattenObject(obj, parentKey = '') {
  if (obj && isObject(obj)) {
    const isArray = Array.isArray(obj);
    return (isArray ? obj : Object.keys(obj)).reduce((acc, k, index) => {
      const objectKey = isArray ? index : k;
      const key = chooseKey({
        parentKey,
        k: objectKey,
        isArray
      });
      const value = obj[objectKey];
      if (isObject(value)) {
        return merge(acc, recursiveFlattenObject(value, key));
      }
      acc[key] = value;
      return acc;
    }, {});
  }
  return obj;
}

const flattenObject = (obj) => recursiveFlattenObject(obj);

module.exports = {
  isObject,
  isEmpty,
  merge,
  flattenObject
};
