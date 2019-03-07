const { assign } = require('lodash');

module.exports = assign({}, require('./lib/function'), require('./lib/json'));
