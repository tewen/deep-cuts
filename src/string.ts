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

export function cleanSpecialCharacters(
  str: string,
  replacement: string = ''
): string {
  return String(str || '')
    .split('')
    .map(char => {
      if (char.charCodeAt(0) > 127) {
        return replacement;
      }
      return char;
    })
    .join('');
}

export function ifNotNilString(value: any) {
  if (
    String(value) === 'undefined' ||
    String(value) === 'null' ||
    String(value) === 'NaN'
  ) {
    return null;
  }
  return value;
}
