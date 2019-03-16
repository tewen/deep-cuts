const { expect } = require('chai');

const { flattenObject } = require('../');

describe('object', function () {
  describe('flattenObject()', function () {
    it('should return undefined if passed undefined', function () {
      expect(flattenObject(undefined)).to.be.undefined;
    });

    it('should return null if passed null', function () {
      expect(flattenObject(null)).to.be.null;
    });

    it('should return a number if passed a number', function () {
      expect(flattenObject(55.5)).to.eql(55.5);
    });

    it('should return a string if passed a string', function () {
      expect(flattenObject('Koolaid City')).to.eql('Koolaid City');
    });

    it('should return an empty object if passed an empty object', function () {
      expect(flattenObject({})).to.eql({});
    });

    it('should return an empty array if passed an empty array', function () {
      expect(flattenObject([])).to.eql({});
    });

    it('should always return a copy of the object', function () {
      const obj = { name: 'Michigan City' };
      expect(flattenObject(obj)).not.to.equal(obj);
    });

    it('should always return an object when passed an array', function () {
      expect(flattenObject([1, 2, { name: 'Steve' }])).to.eql({
        '[0]': 1,
        '[1]': 2,
        '[2].name': 'Steve'
      });
    });

    it('should flatten object properties down into dot syntax compatible with lodash _.get', function () {
      expect(flattenObject({
        name: {
          first: 'Steve',
          last: 'Meyer',
          story: { content: 'long' }
        },
        nation: 'UK',
        city: {
          name: {
            short: 'London',
            long: {
              reallyLong: 'London Business District'
            }
          }
        }
      })).to.eql({
        'name.first': 'Steve',
        'name.last': 'Meyer',
        'name.story.content': 'long',
        nation: 'UK',
        'city.name.short': 'London',
        'city.name.long.reallyLong': 'London Business District'
      });
    });

    it('should flatten array properties down into dot and square bracket syntax compatible with lodash _.get', function () {
      expect(flattenObject({
        name: {
          first: 'Steve',
          last: 'Meyer',
          story: { content: 'long' }
        },
        nation: 'UK',
        city: {
          name: {
            short: 'London',
            long: {
              reallyLong: 'London Business District'
            }
          }
        },
        degrees: [
          {
            college: 'London Business School',
            awarded: {
              date: '1904',
            },
            professors: ['Dr. Rock', 'Dr. John']
          },
          {
            college: 'Oxford',
            awarded: {
              date: '1914',
            },
            professors: ['Dr. Smooth', 'Smooth Bernie', {
              name: 'Extra Smooth',
              smooth: true
            }]
          }
        ]
      })).to.eql({
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
        'degrees[1].professors[2].smooth': true
      });
    });
  });
});
