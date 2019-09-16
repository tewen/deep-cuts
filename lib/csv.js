const _ = require('lodash');
const qs = require('qs');
const { safeJsonParse } = require('./json');

function parseIfFloat(value) {
  const parsed = parseFloat(value);
  return !isNaN(parsed) ? parsed : value;
}

function determineTransform(value, { parseFloats, trimValues }) {
  if (trimValues) {
    return determineTransform(_.trim(value), {
      parseFloats,
      trimValues: false
    });
  } else if (parseFloats) {
    return parseIfFloat(value);
  } else {
    return value;
  }
}

function csvRowsToObjects(rows, options) {
  if (rows && _.size(rows) > 1) {
    const { queryStringsToObjects, jsonStringsToObjects, listDelimiter, parseFloats, trimValues } = _.defaults(options, {
      queryStringsToObjects: false,
      jsonStringsToObjects: false,
      listDelimiter: ',',
      parseFloats: false,
      trimValues: false
    });
    const header = _.chain(_.first(rows)).map((value) => trimValues ? _.trim(value) : value).value();
    return _.chain(rows).tail().map((row) => _.reduce(header, (acc, value, idx) => {
      if (/\[\]$/.test(value)) {
        return _.set(acc, _.replace(value, /\[\]$/, ''), jsonStringsToObjects ? safeJsonParse(`[${row[idx]}]`) : _.chain(row[idx]).split(listDelimiter).map((v) => {
          if (queryStringsToObjects) {
            return qs.parse(v);
          } else {
            return v;
          }
        }).map((v) => determineTransform(v, {
          trimValues,
          parseFloats
        })).value());
      } else {
        return _.set(acc, value, determineTransform(row[idx], {
          trimValues,
          parseFloats
        }));
      }
    }, {})).value();
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
  if (_.isObject(obj)) {
    return _.reduce(obj, (acc, v, k) => {
      const isArray = _.isArray(v);
      const key = chooseKey({
        parentKey,
        k,
        isArray
      });
      if (_.isObject(v) && !isArray) {
        return _.merge(acc, flattenToCsvFormat(v, key));
      }
      acc[key] = v;
      return acc;
    }, {});
  }
  return obj;
}

function objectsToCsvRows(objects, options) {
  if (!_.isEmpty(objects)) {
    const allObjects = _.isArray(objects) ? objects : [objects];
    if (!_.isEmpty(allObjects)) {
      const { queryStringsToObjects, jsonStringsToObjects, listDelimiter } = _.defaults(options, {
        queryStringsToObjects: false,
        jsonStringsToObjects: false,
        listDelimiter: ','
      });
      const flattenedChain = _.chain(allObjects)
        .map((obj) => flattenToCsvFormat(obj));
      const header = flattenedChain
        .map((flattened) => _.keys(flattened))
        .flattenDeep()
        .uniq()
        .value();
      const rows = flattenedChain.map((obj) => _.map(header, (key) => {
        const value = _.get(obj, key, '');
        if (_.isArray(value)) {
          return _.chain(value)
            .map((item) => {
              if (_.isObject(item)) {
                if (queryStringsToObjects) {
                  return qs.stringify(item);
                } else if (jsonStringsToObjects) {
                  return JSON.stringify(item);
                }
              }
              return item;
            })
            .join(listDelimiter)
            .value();
        } else {
          return value;
        }
      })).value();
      return _.concat([header], rows);
    }
  } else {
    return [];
  }
}

module.exports = {
  csvRowsToObjects,
  objectsToCsvRows
};
