const chai = require('chai');
const { expect } = chai;
const { csvRowsToObjects, objectsToCsvRows } = require('../');

describe('csv', function () {
  describe('csvRowsToObjects()', function () {
    it('should return an empty array if passed undefined', function () {
      expect(csvRowsToObjects(undefined)).to.eql([]);
    });

    it('should return an empty array if passed null', function () {
      expect(csvRowsToObjects(null)).to.eql([]);
    });

    it('should return an empty array if passed an empty array', function () {
      expect(csvRowsToObjects([])).to.eql([]);
    });

    it('should return an empty array if passed an array with only the header row', function () {
      expect(csvRowsToObjects([['Red', 'Green', 'Blue']])).to.eql([]);
    });

    it('should return an array of flat objects if the headers are simple properties', function () {
      expect(csvRowsToObjects([
        ['Red', 'Green', 'Blue'],
        ['1', 'Lemmy', 'Ronnie James'],
        ['2', 'Koolaid', 'Peter Griffin']
      ])).to.eql([
        {
          Red: '1',
          Green: 'Lemmy',
          Blue: 'Ronnie James'
        },
        {
          Red: '2',
          Green: 'Koolaid',
          Blue: 'Peter Griffin'
        }
      ]);
    });

    it('should support dot properties in the headers', function () {
      expect(csvRowsToObjects([
        ['Red', 'Green', 'Blue.forty.goodTimes'],
        ['1', 'Lemmy', 'Ronnie James'],
        ['2', 'Koolaid', 'Peter Griffin']
      ])).to.eql([
        {
          Red: '1',
          Green: 'Lemmy',
          Blue: {
            forty: {
              goodTimes: 'Ronnie James'
            }
          }
        },
        {
          Red: '2',
          Green: 'Koolaid',
          Blue: {
            forty: {
              goodTimes: 'Peter Griffin'
            }
          }
        }
      ]);
    });

    it('should support array properties in the headers', function () {
      expect(csvRowsToObjects([
        ['Red', 'Green[]', 'Blue.forty.goodTimes'],
        ['1', 'Lemmy,Cheddar,Iron Maiden', 'Ronnie James'],
        ['2', 'Koolaid,Hawaiian Punch', 'Peter Griffin']
      ])).to.eql([
        {
          Red: '1',
          Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
          Blue: {
            forty: {
              goodTimes: 'Ronnie James'
            }
          }
        },
        {
          Red: '2',
          Green: ['Koolaid', 'Hawaiian Punch'],
          Blue: {
            forty: {
              goodTimes: 'Peter Griffin'
            }
          }
        }
      ]);
    });

    it('should support array properties with single values', function () {
      expect(csvRowsToObjects([
        ['Red', 'Green[]', 'Blue.forty.goodTimes'],
        ['1', 'Iron Maiden', 'Ronnie James'],
        ['2', 'Koolaid,Hawaiian Punch', 'Peter Griffin']
      ])).to.eql([
        {
          Red: '1',
          Green: ['Iron Maiden'],
          Blue: {
            forty: {
              goodTimes: 'Ronnie James'
            }
          }
        },
        {
          Red: '2',
          Green: ['Koolaid', 'Hawaiian Punch'],
          Blue: {
            forty: {
              goodTimes: 'Peter Griffin'
            }
          }
        }
      ]);
    });

    describe('options', function () {
      it('should support query string based objects in the array content cells with an option set (off by default)', function () {
        expect(csvRowsToObjects([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1', 'name=Iron Maiden&age=51,name=Motorhead&age=55', 'Ronnie James'],
          ['2', 'name=Green&age=26', 'Peter Griffin']
        ], { queryStringsToObjects: true })).to.eql([
          {
            Red: '1',
            Green: [{
              name: 'Iron Maiden',
              age: '51'
            }, {
              name: 'Motorhead',
              age: '55'
            }],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: '2',
            Green: [{
              name: 'Green',
              age: '26'
            }],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ]);
      });

      it('should support json object in the array content cells with an option set (off by default)', function () {
        expect(csvRowsToObjects([
          ['Red', 'Temp.Green[]', 'Blue.forty.goodTimes'],
          ['1', '{"name":"Iron Maiden","age":"51"},{"name":"Motorhead","age":"55"}', 'Ronnie James'],
          ['2', '{"name":"Green", "age": "26"}', 'Peter Griffin']
        ], { jsonStringsToObjects: true })).to.eql([
          {
            Red: '1',
            Temp: {
              Green: [{
                name: 'Iron Maiden',
                age: '51'
              }, {
                name: 'Motorhead',
                age: '55'
              }],
            },
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: '2',
            Temp: {
              Green: [{
                name: 'Green',
                age: '26'
              }],
            },
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ]);
      });

      it('should support a custom delimiter for the array properties (comma by default)', function () {
        expect(csvRowsToObjects([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1', 'Lemmy;Cheddar;Iron Maiden', 'Ronnie James'],
          ['2', 'Koolaid;Hawaiian Punch', 'Peter Griffin']
        ], { listDelimiter: ';' })).to.eql([
          {
            Red: '1',
            Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: '2',
            Green: ['Koolaid', 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ]);
      });

      it('should be able to parse floats if the option is set (off by default)', function () {
        expect(csvRowsToObjects([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1', 'Lemmy,Cheddar,Iron Maiden', 'Ronnie James'],
          ['2', 'Koolaid,52.25,Hawaiian Punch', 'Peter Griffin']
        ], { parseFloats: true })).to.eql([
          {
            Red: 1,
            Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: 2,
            Green: ['Koolaid', 52.25, 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ]);
      });

      it('should trim the values in the rows (off by default)', function () {
        expect(csvRowsToObjects([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1  ', ' Iron Maiden ', 'Ronnie James'],
          ['2', ' Koolaid,Hawaiian Punch ', 'Peter Griffin']
        ], { trimValues: true })).to.eql([
          {
            Red: '1',
            Green: ['Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: '2',
            Green: ['Koolaid', 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ]);
      });

      it('should play nice with a mix of options', function () {
        expect(csvRowsToObjects([
          ['Red', 'Green[]', ' Blue.forty.goodTimes'],
          ['1', ' Lemmy,Cheddar,Iron Maiden', ' Ronnie James'],
          ['2', 'Koolaid,52.25,Hawaiian Punch ', ' Peter Griffin']
        ], {
          parseFloats: true,
          trimValues: true
        })).to.eql([
          {
            Red: 1,
            Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: 2,
            Green: ['Koolaid', 52.25, 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ]);
      });
    });
  });

  describe('objectsToCsvRows()', function () {
    it('should return an empty array if passed undefined', function () {
      expect(objectsToCsvRows(undefined)).to.eql([]);
    });

    it('should return an empty array if passed null', function () {
      expect(objectsToCsvRows(null)).to.eql([]);
    });

    it('should return an empty array if passed an empty array', function () {
      expect(objectsToCsvRows([])).to.eql([]);
    });

    it('should return the header row and a single content row if passed a single object', function () {
      expect(objectsToCsvRows({
        red: 27,
        green: 'Hello'
      })).to.eql([['red', 'green'], [27, 'Hello']]);
    });

    it('should return the header row and all the rows if passed an array of objects', function () {
      expect(objectsToCsvRows([
        {
          Red: '1',
          Green: 'Lemmy',
          Blue: 'Ronnie James'
        },
        {
          Red: '2',
          Green: 'Koolaid',
          Blue: 'Peter Griffin'
        }
      ])).to.eql([
        ['Red', 'Green', 'Blue'],
        ['1', 'Lemmy', 'Ronnie James'],
        ['2', 'Koolaid', 'Peter Griffin']
      ]);
    });

    it('should assemble header using the master list of all properties from all objects', function () {
      expect(objectsToCsvRows([
        {
          Red: '1',
          Green: 'Lemmy',
          Blue: 'Ronnie James',
          Purple: 42
        },
        {
          Red: '2',
          Green: 'Koolaid',
          Blue: 'Peter Griffin',
          Maroon: 88
        }
      ])).to.eql([
        ['Red', 'Green', 'Blue', 'Purple', 'Maroon'],
        ['1', 'Lemmy', 'Ronnie James', 42, ''],
        ['2', 'Koolaid', 'Peter Griffin', '', 88]
      ]);
    });

    it('should properly map dot properties out to rows', function () {
      expect(objectsToCsvRows([
        {
          Red: '1',
          Green: 'Lemmy',
          Blue: {
            forty: {
              goodTimes: 'Ronnie James'
            }
          }
        },
        {
          Red: '2',
          Green: 'Koolaid',
          Blue: {
            forty: {
              goodTimes: 'Peter Griffin'
            }
          }
        }
      ])).to.eql([
        ['Red', 'Green', 'Blue.forty.goodTimes'],
        ['1', 'Lemmy', 'Ronnie James'],
        ['2', 'Koolaid', 'Peter Griffin']
      ]);
    });

    it('should properly map array properties out to rows', function () {
      expect(objectsToCsvRows([
        {
          Red: '1',
          Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
          Blue: {
            forty: {
              goodTimes: 'Ronnie James'
            }
          }
        },
        {
          Red: '2',
          Green: ['Koolaid', 'Hawaiian Punch'],
          Blue: {
            forty: {
              goodTimes: 'Peter Griffin'
            }
          }
        }
      ])).to.eql([
        ['Red', 'Green[]', 'Blue.forty.goodTimes'],
        ['1', 'Lemmy,Cheddar,Iron Maiden', 'Ronnie James'],
        ['2', 'Koolaid,Hawaiian Punch', 'Peter Griffin']
      ]);
    });

    describe('options', function () {
      it('should support query string based objects in the array content cells with an option set (off by default)', function () {
        expect(objectsToCsvRows([
          {
            Red: '1',
            Green: [{
              name: 'Iron Maiden',
              age: '51'
            }, {
              name: 'Motorhead',
              age: '55'
            }],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: '2',
            Green: [{
              name: 'Green',
              age: '26'
            }],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ], { queryStringsToObjects: true })).to.eql([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1', 'name=Iron%20Maiden&age=51,name=Motorhead&age=55', 'Ronnie James'],
          ['2', 'name=Green&age=26', 'Peter Griffin']
        ]);
      });

      it('should support json object in the array content cells with an option set (off by default)', function () {
        expect(objectsToCsvRows([
          {
            Red: '1',
            Temp: {
              Green: [{
                name: 'Iron Maiden',
                age: '51'
              }, {
                name: 'Motorhead',
                age: '55'
              }],
            },
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: '2',
            Temp: {
              Green: [{
                name: 'Green',
                age: '26'
              }],
            },
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ], { jsonStringsToObjects: true })).to.eql([
          ['Red', 'Temp.Green[]', 'Blue.forty.goodTimes'],
          ['1', '{"name":"Iron Maiden","age":"51"},{"name":"Motorhead","age":"55"}', 'Ronnie James'],
          ['2', '{"name":"Green","age":"26"}', 'Peter Griffin']
        ]);
      });

      it('should support a custom delimiter for array values (comma by default)', function () {
        expect(objectsToCsvRows([
          {
            Red: '1',
            Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: '2',
            Green: ['Koolaid', 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ], { listDelimiter: ';' })).to.eql([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1', 'Lemmy;Cheddar;Iron Maiden', 'Ronnie James'],
          ['2', 'Koolaid;Hawaiian Punch', 'Peter Griffin']
        ]);
      });

      it('should play nice with a mix of options', function () {
        expect(objectsToCsvRows([
          {
            Red: '1',
            Green: [{
              name: 'Iron Maiden',
              age: '51'
            }, {
              name: 'Motorhead',
              age: '55'
            }],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James'
              }
            }
          },
          {
            Red: '2',
            Green: [{
              name: 'Green',
              age: '26'
            }],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin'
              }
            }
          }
        ], { queryStringsToObjects: true, listDelimiter: ';' })).to.eql([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1', 'name=Iron%20Maiden&age=51;name=Motorhead&age=55', 'Ronnie James'],
          ['2', 'name=Green&age=26', 'Peter Griffin']
        ]);
      });
    });
  });
});
