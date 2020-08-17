const qs = require('qs');
const { safeJsonParse } = require('./json');
const { isObject, isEmpty, merge } = require('./object');
const { getValue, setValue } = require('./internal');

function parseIfFloat(value) {
  const parsed = parseFloat(value);
  return !isNaN(parsed) ? parsed : value;
}

function determineTransform(value, { parseFloats, trimValues }) {
  if (trimValues) {
    return determineTransform(value.trim(), {
      parseFloats,
      trimValues: false
    });
  } else if (parseFloats) {
    return parseIfFloat(value);
  } else {
    return value;
  }
}

function reduceObjectOrArray(objOrArray, cb, acc) {
  if (Array.isArray(objOrArray)) {
    return objOrArray.reduce(cb, acc);
  } else {
    return Object.keys(objOrArray || {}).reduce((acc, k) => {
      const v = objOrArray[k];
      return cb(acc, v, k);
    }, acc);
  }
}

const flattenDeep = ar => Array.isArray(ar) ? (ar || []).reduce((acc, v) => acc.concat(flattenDeep(v)), []) : ar;

const unique = ar => [...new Set(ar)];

function csvRowsToObjects(rows, options) {
  if (rows && rows.length > 1) {
    const { queryStringsToObjects, jsonStringsToObjects, listDelimiter, parseFloats, trimValues } = ((opts) => ({
      queryStringsToObjects: opts.queryStringsToObjects || false,
      jsonStringsToObjects: opts.jsonStringsToObjects || false,
      listDelimiter: opts.listDelimiter || ',',
      parseFloats: opts.parseFloats || false,
      trimValues: opts.trimValues || false
    }))(options || {});
    const header = rows[0].map((value) => trimValues ? (value || '').trim() : value);
    return rows.slice(1).map((row) => header.reduce((acc, value, idx) => {
      if (/\[\]$/.test(value)) {
        return setValue(acc, value.replace(/\[\]$/, ''), jsonStringsToObjects ? safeJsonParse(`[${row[idx]}]`) : row[idx].split(listDelimiter).map((v) => {
          if (queryStringsToObjects) {
            return qs.parse(v);
          } else {
            return v;
          }
        }).map((v) => determineTransform(v, {
          trimValues,
          parseFloats
        })));
      } else {
        return setValue(acc, value, determineTransform(row[idx], {
          trimValues,
          parseFloats
        }));
      }
    }, {}));
  } else {
    return [];
  }
}

function chooseKey({ parentKey, k, isArray }) {
  if (parentKey) {
    const key = chooseKey({
      k,
      isArray
    });
    return `${parentKey}.${key}`;
  }
  return isArray ? `${k}[]` : k;
}

// NOTE - This is very similar but not quite the same as the one in object.js
function flattenToCsvFormat(obj, parentKey = '') {
  if (isObject(obj)) {
    return reduceObjectOrArray(obj, (acc, v, k) => {
      const isArray = Array.isArray(v);
      const key = chooseKey({
        parentKey,
        k,
        isArray
      });
      if (isObject(v) && !isArray) {
        return merge(acc, flattenToCsvFormat(v, key));
      }
      acc[key] = v;
      return acc;
    }, {});
  }
  return obj;
}

function objectsToCsvRows(objects, options) {
  if (!isEmpty(objects)) {
    const allObjects = Array.isArray(objects) ? objects : [objects];
    if (!isEmpty(allObjects)) {
      const { queryStringsToObjects, jsonStringsToObjects, listDelimiter } = ((opts) => ({
        queryStringsToObjects: opts.queryStringsToObjects || false,
        jsonStringsToObjects: opts.jsonStringsToObjects || false,
        listDelimiter: opts.listDelimiter || ','
      }))(options || {});
      const flattenedBase = allObjects.map(obj => flattenToCsvFormat(obj));
      const header = unique(
        flattenDeep(
          flattenedBase
            .map((flattened) => Object.keys(flattened))
        )
      );
      const rows = flattenedBase.map((obj) => header.map((key) => {
        const value = getValue(obj, key, obj[key]) || '';
        if (Array.isArray(value)) {
          return value.map((item) => {
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
      }));
      return [header].concat(rows);
    }
  } else {
    return [];
  }
}

module.exports = {
  csvRowsToObjects,
  objectsToCsvRows
};
