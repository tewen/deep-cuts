const _ = require('lodash');

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
  safeJsonParse
};
