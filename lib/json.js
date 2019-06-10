const _ = require('lodash');

function isJsonString(str) {
  try {
    return _.isObject(JSON.parse(str));
  } catch (e) {
    return false;
  }
}

function safeJsonParse(obj) {
  if (obj && _.isString(obj)) {
    try {
      return JSON.parse(obj);
    } catch (e) {
      // Do nothing here
    }
  }
  return null;
}

module.exports = {
  isJsonString,
  safeJsonParse
};
