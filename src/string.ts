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

export function camelCaseToTitleCase(value: string): string {
  if (
    !/_|-|\s/gi.test(value) &&
    (value || '').charAt(0) !== (value || '').charAt(0).toUpperCase()
  ) {
    const withSpaces = (value || '').replace(/([A-Z])/g, ' $1');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }
  return value || '';
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
