export function stringToBoolean(strBoolean: any): boolean {
  const str = String(strBoolean);
  return !(
    str === 'false' ||
    str === '0' ||
    str === 'null' ||
    str === 'undefined' ||
    str === ''
  );
}

export function escapeForRegExp(str: string): string {
  /* eslint-disable no-useless-escape */
  return typeof str === 'string'
    ? str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    : str;
  /* eslint-enable no-useless-escape */
}
