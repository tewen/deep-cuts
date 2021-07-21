export function getValue(
  obj: Record<string, any>,
  keyPath: string,
  defaultValue: any
): unknown {
  const split = keyPath
    .trim()
    .replace(/\[|\]/g, '')
    .split('.');
  const first = split[0];
  const tail = split.slice(1);
  if (obj) {
    const parsedFirst = /^\d+$/.test(first) ? parseInt(first) : first;
    const value = obj[parsedFirst];
    if (tail.length) {
      return getValue(value, tail.join('.'), defaultValue);
    }
    return value !== undefined ? value : defaultValue;
  }
  return defaultValue;
}

export function setValue(
  obj: Record<string, any>,
  keyPath: string,
  value: any
): Record<string, any> {
  const split = keyPath
    .trim()
    .replace(/\[|\]/g, '')
    .split('.');
  const first = split[0];
  const tail = split.slice(1);
  if (tail.length) {
    const secondIsArrayIndex = /^\d+$/.test(tail[0]);
    const newObj = obj[first] || (secondIsArrayIndex ? [] : {});
    obj[first] = setValue(newObj, tail.join('.'), value);
  } else {
    obj[first] = value;
  }
  return obj;
}
