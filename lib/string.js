function stringToBoolean(strBoolean) {
  const str = String(strBoolean);
  return !(str === 'false' || str === '0' || str === 'null' || str === 'undefined' || str === '');
}

function escapeForRegExp(str) {
  return typeof str === 'string' ? str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : str; // eslint-disable-line no-useless-escape
}

module.exports = {
  stringToBoolean,
  escapeForRegExp
};
