const { isObject } = require('./object');

function isJsonString(str) {
  try {
    return isObject(JSON.parse(str));
  } catch (e) {
    return false;
  }
}

function safeJsonParse(obj) {
  if (obj && typeof obj === 'string') {
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
