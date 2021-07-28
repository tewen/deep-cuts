import qs from 'qs';
import { isObject, isEmpty, merge } from './object';
import { safeJsonParse } from './json';
import { getValue, setValue } from './internal';

type ReduceCallback = <T extends object>(
  acc: T,
  value: any,
  index: number | string
) => T;

function parseIfFloat(value: string): unknown {
  const parsed = parseFloat(value);
  return !isNaN(parsed) ? parsed : value;
}

function determineTransform(
  value: string,
  { parseFloats, trimValues }: { parseFloats?: boolean; trimValues?: boolean }
): unknown {
  if (trimValues) {
    return determineTransform((value || '').trim(), {
      parseFloats,
      trimValues: false,
    });
  } else if (parseFloats) {
    return parseIfFloat(value);
  } else {
    return value;
  }
}

function reduceObjectOrArray(
  objOrArray: any[] | Record<string, any>,
  cb: ReduceCallback,
  acc: any[] | Record<string, any>
): any[] | Record<string, any> {
  if (Array.isArray(objOrArray)) {
    return objOrArray.reduce(cb, acc);
  } else {
    return Object.keys(objOrArray || {}).reduce((acc, k) => {
      const v = objOrArray[k];
      return cb(acc, v, k);
    }, acc);
  }
}

const flattenDeep = (ar: any[]): any[] =>
  Array.isArray(ar)
    ? (ar || []).reduce((acc, v) => acc.concat(flattenDeep(v)), [])
    : ar;

const unique = (ar: any[]): any[] => Array.from(new Set(ar));

export function csvRowsToObjects(
  rows: any[][],
  options?: {
    queryStringsToObjects?: boolean;
    jsonStringsToObjects?: boolean;
    listDelimiter?: string;
    parseFloats?: boolean;
    trimValues?: boolean;
  }
): Record<string, any>[] {
  if (rows && rows.length > 1) {
    const {
      queryStringsToObjects,
      jsonStringsToObjects,
      listDelimiter,
      parseFloats,
      trimValues,
    } = (opts => ({
      queryStringsToObjects: opts.queryStringsToObjects || false,
      jsonStringsToObjects: opts.jsonStringsToObjects || false,
      listDelimiter: opts.listDelimiter || ',',
      parseFloats: opts.parseFloats || false,
      trimValues: opts.trimValues || false,
    }))(options || {});
    const header = rows[0].map(value =>
      trimValues ? (value || '').trim() : value
    );
    return rows.slice(1).map(row =>
      header.reduce((acc, value, idx) => {
        if (/\[\]$/.test(value)) {
          return setValue(
            acc,
            value.replace(/\[\]$/, ''),
            jsonStringsToObjects
              ? safeJsonParse(`[${row[idx]}]`)
              : row[idx]
                  .split(listDelimiter)
                  .map((v: string) => {
                    if (queryStringsToObjects) {
                      return qs.parse(v);
                    } else {
                      return v;
                    }
                  })
                  .map((v: string) =>
                    determineTransform(v, {
                      trimValues,
                      parseFloats,
                    })
                  )
          );
        } else {
          return setValue(
            acc,
            value,
            determineTransform(row[idx], {
              trimValues,
              parseFloats,
            })
          );
        }
      }, {})
    );
  } else {
    return [];
  }
}

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
    const key: string = chooseKey({
      k,
      isArray,
    });
    return `${parentKey}.${key}`;
  }
  return isArray ? `${k}[]` : k;
}

// NOTE - This is very similar but not quite the same as the one in object.js
function flattenToCsvFormat(
  obj: Record<string, any>,
  parentKey: string = ''
): Record<string, any> {
  if (isObject(obj)) {
    return reduceObjectOrArray(
      obj,
      // @ts-ignore
      (acc: Record<string, any>, v, k) => {
        const isArray = Array.isArray(v);
        const key = chooseKey({
          parentKey,
          k: String(k),
          isArray,
        });
        if (isObject(v) && !isArray) {
          return merge(acc, flattenToCsvFormat(v, key));
        }
        acc[key] = v;
        return acc;
      },
      {} as Record<string, any>
    );
  }
  return obj;
}

export function objectsToCsvRows(
  objects: Record<string, any>[] | Record<string, any>,
  options?: {
    queryStringsToObjects?: boolean;
    jsonStringsToObjects?: boolean;
    listDelimiter?: string;
  }
): any[] {
  if (!isEmpty(objects)) {
    const allObjects = Array.isArray(objects) ? objects : [objects];
    if (!isEmpty(allObjects)) {
      const {
        queryStringsToObjects,
        jsonStringsToObjects,
        listDelimiter,
      } = (opts => ({
        queryStringsToObjects: opts.queryStringsToObjects || false,
        jsonStringsToObjects: opts.jsonStringsToObjects || false,
        listDelimiter: opts.listDelimiter || ',',
      }))(options || {});
      const flattenedBase = allObjects.map(obj => flattenToCsvFormat(obj));
      const header = unique(
        flattenDeep(flattenedBase.map(flattened => Object.keys(flattened)))
      );
      const rows = flattenedBase.map(obj =>
        header.map(key => {
          const value = getValue(obj, key, obj[key]) || '';
          if (Array.isArray(value)) {
            return value
              .map(item => {
                if (isObject(item)) {
                  if (queryStringsToObjects) {
                    return qs.stringify(item);
                  } else if (jsonStringsToObjects) {
                    return JSON.stringify(item);
                  }
                }
                return item;
              })
              .join(listDelimiter);
          } else {
            return value;
          }
        })
      );
      return [header].concat(rows);
    }
  }
  return [];
}
