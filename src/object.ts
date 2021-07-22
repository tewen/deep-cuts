const definedValues = (obj: Record<string, any>): Record<string, any> =>
  obj
    ? Object.keys(obj).reduce((acc, key) => {
        if (obj[key] !== undefined) {
          acc[key] = obj[key];
        }
        return acc;
      }, {} as Record<string, any>)
    : {};

export const isObject = (val: any): boolean =>
  val !== null && typeof val === 'object';

const isNonArrayObject = (val: any): boolean =>
  isObject(val) && !Array.isArray(val);

export const isEmpty = (val: any): boolean =>
  (!val && val !== false && val !== 0) ||
  (isNonArrayObject(val) && !Object.keys(val).length) ||
  (Array.isArray(val) && !val.length) ||
  (typeof val === 'string' && val.trim() === '');

function recursiveMerge(
  a: Record<string, any>,
  b: Record<string, any>
): Record<string, any> {
  const definedA = definedValues(a);
  const definedB = definedValues(b);
  const merged = {
    ...definedA,
    ...definedB,
  };
  Object.keys(definedA).forEach(key => {
    if (isNonArrayObject(definedA[key]) && isNonArrayObject(definedB[key])) {
      merged[key] = recursiveMerge(definedA[key], definedB[key]);
    }
  });
  return merged;
}

export const merge = (...args: Record<string, any>[]): Record<string, any> =>
  args.reduce((acc, obj) => recursiveMerge(acc, obj), {});

function chooseKey({
  parentKey,
  k,
  isArray,
}: {
  parentKey?: string;
  k: string;
  isArray: boolean;
}): string {
  if (parentKey) {
    const key = chooseKey({
      k,
      isArray,
    });
    return `${parentKey}${isArray ? key : `.${key}`}`;
  }
  return isArray ? `[${k}]` : k;
}

function recursiveFlattenObject(
  obj: Record<string, any>,
  parentKey = ''
): Record<string, any> {
  if (obj && isObject(obj)) {
    const isArray = Array.isArray(obj);
    return (isArray ? obj : Object.keys(obj)).reduce(
      (acc: Record<string, any>, k: string, index: number) => {
        const objectKey = isArray ? String(index) : k;
        const key = chooseKey({
          parentKey,
          k: objectKey,
          isArray,
        });
        const value = obj[objectKey];
        if (isObject(value)) {
          return merge(acc, recursiveFlattenObject(value, key));
        }
        acc[key] = value;
        return acc;
      },
      {} as Record<string, any>
    );
  }
  return obj;
}

export const flattenObject = (obj: Record<string, any>): Record<string, any> =>
  recursiveFlattenObject(obj);
