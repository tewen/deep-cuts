import { isObject, isEmpty, merge, flattenObject } from '../';

describe('object', () => {
  describe('isObject()', () => {
    it('should return false for undefined', () => {
      expect(isObject(undefined)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for numbers', () => {
      expect(isObject(55)).toBe(false);
    });

    it('should return false for string', () => {
      expect(isObject('Red')).toBe(false);
    });

    it('should return false for a boolean', () => {
      expect(isObject(true)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(isObject(NaN)).toBe(false);
    });

    it('should return false for a function', () => {
      expect(isObject(jest.fn())).toBe(false);
    });

    it('should return true for an object', () => {
      expect(isObject({})).toBe(true);
    });

    it('should return true for an array', () => {
      expect(isObject([])).toBe(true);
    });
  });

  describe('isEmpty()', () => {
    it('should return true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('should return true for an empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return true for an empty string with spaces', () => {
      expect(isEmpty('     ')).toBe(true);
    });

    it('should return true for an empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return true for an empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for NaN', () => {
      expect(isEmpty(NaN)).toBe(true);
    });

    it('should return false for a string with characters', () => {
      expect(isEmpty('Red Team, Go')).toBe(false);
    });

    it('should return false for 0', () => {
      expect(isEmpty(0)).toBe(false);
    });

    it('should return false for any number', () => {
      expect(isEmpty(1897.2727)).toBe(false);
    });

    it('should return false for true', () => {
      expect(isEmpty(true)).toBe(false);
    });

    it('should return false for false', () => {
      expect(isEmpty(false)).toBe(false);
    });

    it('should return false for a function', () => {
      expect(isEmpty(jest.fn())).toBe(false);
    });
  });

  describe('flattenObject()', () => {
    it('should return undefined if passed undefined', () => {
      // @ts-ignore
      expect(flattenObject(undefined)).toBeUndefined();
    });

    it('should return null if passed null', () => {
      // @ts-ignore
      expect(flattenObject(null)).toBeNull();
    });

    it('should return a number if passed a number', () => {
      // @ts-ignore
      expect(flattenObject(55.5)).toEqual(55.5);
    });

    it('should return a string if passed a string', () => {
      // @ts-ignore
      expect(flattenObject('Koolaid City')).toEqual('Koolaid City');
    });

    it('should return an empty object if passed an empty object', () => {
      expect(flattenObject({})).toEqual({});
    });

    it('should return an empty array if passed an empty array', () => {
      expect(flattenObject([])).toEqual({});
    });

    it('should always return a copy of the object', () => {
      const obj = { name: 'Michigan City' };
      expect(flattenObject(obj)).not.toBe(obj);
    });

    it('should always return an object when passed an array', () => {
      expect(flattenObject([1, 2, { name: 'Steve' }])).toEqual({
        '[0]': 1,
        '[1]': 2,
        '[2].name': 'Steve',
      });
    });

    it('should flatten object properties down into dot syntax compatible with lodash _.get', () => {
      expect(
        flattenObject({
          name: {
            first: 'Steve',
            last: 'Meyer',
            story: { content: 'long' },
          },
          nation: 'UK',
          city: {
            name: {
              short: 'London',
              long: {
                reallyLong: 'London Business District',
              },
            },
          },
        })
      ).toEqual({
        'name.first': 'Steve',
        'name.last': 'Meyer',
        'name.story.content': 'long',
        nation: 'UK',
        'city.name.short': 'London',
        'city.name.long.reallyLong': 'London Business District',
      });
    });

    it('should flatten array properties down into dot and square bracket syntax compatible with lodash _.get', () => {
      expect(
        flattenObject({
          name: {
            first: 'Steve',
            last: 'Meyer',
            story: { content: 'long' },
          },
          nation: 'UK',
          city: {
            name: {
              short: 'London',
              long: {
                reallyLong: 'London Business District',
              },
            },
          },
          degrees: [
            {
              college: 'London Business School',
              awarded: {
                date: '1904',
              },
              professors: ['Dr. Rock', 'Dr. John'],
            },
            {
              college: 'Oxford',
              awarded: {
                date: '1914',
              },
              professors: [
                'Dr. Smooth',
                'Smooth Bernie',
                {
                  name: 'Extra Smooth',
                  smooth: true,
                },
              ],
            },
          ],
        })
      ).toEqual({
        'name.first': 'Steve',
        'name.last': 'Meyer',
        'name.story.content': 'long',
        nation: 'UK',
        'city.name.short': 'London',
        'city.name.long.reallyLong': 'London Business District',
        'degrees[0].college': 'London Business School',
        'degrees[0].awarded.date': '1904',
        'degrees[0].professors[0]': 'Dr. Rock',
        'degrees[0].professors[1]': 'Dr. John',
        'degrees[1].college': 'Oxford',
        'degrees[1].awarded.date': '1914',
        'degrees[1].professors[0]': 'Dr. Smooth',
        'degrees[1].professors[1]': 'Smooth Bernie',
        'degrees[1].professors[2].name': 'Extra Smooth',
        'degrees[1].professors[2].smooth': true,
      });
    });
  });

  describe('merge()', () => {
    it('should return an object if passed nothing', () => {
      expect(merge()).toEqual({});
    });

    it('should return an object if passed undefined', () => {
      // @ts-ignore
      expect(merge(undefined)).toEqual({});
    });

    it('should return an object if passed null', () => {
      // @ts-ignore
      expect(merge(null)).toEqual({});
    });

    it('should return an object if passed empty objects', () => {
      expect(merge({}, {}, {})).toEqual({});
    });

    it('should return an object if passed a set of empty objects, null, and undefined', () => {
      // @ts-ignore
      expect(merge({}, null, {}, undefined, {})).toEqual({});
    });

    it('should never modify the original object', () => {
      const originalObj = { id: 1 };
      const newObj = merge(originalObj);
      expect(newObj).toEqual(originalObj);
      expect(newObj).not.toBe(originalObj);
    });

    it('should do a shallow merge with overwrites', () => {
      expect(
        merge(
          {
            id: 1,
            color: 'red',
          },
          {
            id: 2,
            flavor: 'Strawberry',
          },
          {
            id: 3,
          }
        )
      ).toEqual({
        id: 3,
        color: 'red',
        flavor: 'Strawberry',
      });
    });

    it('should not allow undefined to do any overwrites in a shallow merge', () => {
      expect(
        merge(
          {
            id: 1,
            color: 'red',
          },
          {
            id: 2,
            flavor: 'Strawberry',
            color: undefined,
          },
          {
            id: 3,
            flavor: undefined,
          }
        )
      ).toEqual({
        id: 3,
        color: 'red',
        flavor: 'Strawberry',
      });
    });

    it('should allow falsey values to overwrite in a shallow merge', () => {
      expect(
        merge(
          {
            id: 1,
            color: 'red',
          },
          {
            id: 2,
            flavor: 'Strawberry',
            color: null,
          },
          {
            id: 3,
            flavor: false,
          }
        )
      ).toEqual({
        id: 3,
        color: null,
        flavor: false,
      });
    });

    it('should be able to do deep merges', () => {
      const a = {
        Red: '1',
        Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
        Blue: {
          forty: {
            goodTimes: 'Ronnie James',
          },
          fifty: {
            id: 50,
          },
        },
      };
      const b = {
        Yellow: '2',
        Green: ['Koolaid', 'Hawaiian Punch'],
        Blue: {
          forty: {
            goodTimes: 'Peter Griffin',
          },
          sixty: {
            id: 60,
          },
        },
      };
      expect(merge(a, b)).toEqual({
        Red: '1',
        Yellow: '2',
        Green: ['Koolaid', 'Hawaiian Punch'],
        Blue: {
          forty: {
            goodTimes: 'Peter Griffin',
          },
          fifty: {
            id: 50,
          },
          sixty: {
            id: 60,
          },
        },
      });
    });

    it('should not allow undefined to do any overwrites in a deep merge', () => {
      const a = {
        Red: '1',
        Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
        Blue: {
          forty: {
            goodTimes: 'Ronnie James',
          },
          fifty: {
            id: 50,
          },
        },
      };
      const b = {
        Yellow: '2',
        Green: undefined,
        Blue: {
          forty: {
            goodTimes: 'Peter Griffin',
          },
          sixty: {
            id: 60,
          },
        },
      };
      expect(merge(a, b)).toEqual({
        Red: '1',
        Yellow: '2',
        Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
        Blue: {
          forty: {
            goodTimes: 'Peter Griffin',
          },
          fifty: {
            id: 50,
          },
          sixty: {
            id: 60,
          },
        },
      });
    });

    it('should allow falsey values to overwrite in a deeo merge merge', () => {
      const a = {
        Red: '1',
        Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
        Blue: {
          forty: {
            goodTimes: 'Ronnie James',
          },
          fifty: {
            id: 50,
          },
        },
      };
      const b = {
        Yellow: '2',
        Green: null,
        Blue: {
          forty: false,
          sixty: {
            id: 60,
          },
        },
      };
      expect(merge(a, b)).toEqual({
        Red: '1',
        Yellow: '2',
        Green: null,
        Blue: {
          forty: false,
          fifty: {
            id: 50,
          },
          sixty: {
            id: 60,
          },
        },
      });
    });
  });
});
