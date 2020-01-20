const { assign } = require('lodash');

module.exports = assign(
  {},
  require('./lib/csv'),
  require('./lib/function'),
  require('./lib/json'),
  require('./lib/object'),
  require('./lib/stream'),
  require('./lib/string')
);
