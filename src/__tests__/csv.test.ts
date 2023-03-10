import { csvRowsToObjects, objectsToCsvRows } from '../';

describe('csv', () => {
  describe('csvRowsToObjects()', () => {
    it('should return an empty array if passed undefined', () => {
      // @ts-ignore
      expect(csvRowsToObjects(undefined)).toEqual([]);
    });

    it('should return an empty array if passed null', () => {
      // @ts-ignore
      expect(csvRowsToObjects(null)).toEqual([]);
    });

    it('should return an empty array if passed an empty array', () => {
      expect(csvRowsToObjects([])).toEqual([]);
    });

    it('should return an empty array if passed an array with only the header row', () => {
      expect(csvRowsToObjects([['Red', 'Green', 'Blue']])).toEqual([]);
    });

    it('should return an array of flat objects if the headers are simple properties', () => {
      expect(
        csvRowsToObjects([
          ['Red', 'Green', 'Blue'],
          ['1', 'Lemmy', 'Ronnie James'],
          ['2', 'Koolaid', 'Peter Griffin'],
        ])
      ).toEqual([
        {
          Red: '1',
          Green: 'Lemmy',
          Blue: 'Ronnie James',
        },
        {
          Red: '2',
          Green: 'Koolaid',
          Blue: 'Peter Griffin',
        },
      ]);
    });

    it('should support dot properties in the headers', () => {
      expect(
        csvRowsToObjects([
          ['Red', 'Green', 'Blue.forty.goodTimes'],
          ['1', 'Lemmy', 'Ronnie James'],
          ['2', 'Koolaid', 'Peter Griffin'],
        ])
      ).toEqual([
        {
          Red: '1',
          Green: 'Lemmy',
          Blue: {
            forty: {
              goodTimes: 'Ronnie James',
            },
          },
        },
        {
          Red: '2',
          Green: 'Koolaid',
          Blue: {
            forty: {
              goodTimes: 'Peter Griffin',
            },
          },
        },
      ]);
    });

    it('should support array properties in the headers', () => {
      expect(
        csvRowsToObjects([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1', 'Lemmy,Cheddar,Iron Maiden', 'Ronnie James'],
          ['2', 'Koolaid,Hawaiian Punch', 'Peter Griffin'],
        ])
      ).toEqual([
        {
          Red: '1',
          Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
          Blue: {
            forty: {
              goodTimes: 'Ronnie James',
            },
          },
        },
        {
          Red: '2',
          Green: ['Koolaid', 'Hawaiian Punch'],
          Blue: {
            forty: {
              goodTimes: 'Peter Griffin',
            },
          },
        },
      ]);
    });

    it('should support array properties with single values', () => {
      expect(
        csvRowsToObjects([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1', 'Iron Maiden', 'Ronnie James'],
          ['2', 'Koolaid,Hawaiian Punch', 'Peter Griffin'],
        ])
      ).toEqual([
        {
          Red: '1',
          Green: ['Iron Maiden'],
          Blue: {
            forty: {
              goodTimes: 'Ronnie James',
            },
          },
        },
        {
          Red: '2',
          Green: ['Koolaid', 'Hawaiian Punch'],
          Blue: {
            forty: {
              goodTimes: 'Peter Griffin',
            },
          },
        },
      ]);
    });

    describe('options', () => {
      it('should support query string based objects in the array content cells with an option set (off by default)', () => {
        expect(
          csvRowsToObjects(
            [
              ['Red', 'Green[]', 'Blue.forty.goodTimes'],
              [
                '1',
                'name=Iron Maiden&age=51,name=Motorhead&age=55',
                'Ronnie James',
              ],
              ['2', 'name=Green&age=26', 'Peter Griffin'],
            ],
            { queryStringsToObjects: true }
          )
        ).toEqual([
          {
            Red: '1',
            Green: [
              {
                name: 'Iron Maiden',
                age: '51',
              },
              {
                name: 'Motorhead',
                age: '55',
              },
            ],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James',
              },
            },
          },
          {
            Red: '2',
            Green: [
              {
                name: 'Green',
                age: '26',
              },
            ],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin',
              },
            },
          },
        ]);
      });

      it('should support json object in the array content cells with an option set (off by default)', () => {
        expect(
          csvRowsToObjects(
            [
              ['Red', 'Temp.Green[]', 'Blue.forty.goodTimes'],
              [
                '1',
                '{"name":"Iron Maiden","age":"51"},{"name":"Motorhead","age":"55"}',
                'Ronnie James',
              ],
              ['2', '{"name":"Green", "age": "26"}', 'Peter Griffin'],
            ],
            { jsonStringsToObjects: true }
          )
        ).toEqual([
          {
            Red: '1',
            Temp: {
              Green: [
                {
                  name: 'Iron Maiden',
                  age: '51',
                },
                {
                  name: 'Motorhead',
                  age: '55',
                },
              ],
            },
            Blue: {
              forty: {
                goodTimes: 'Ronnie James',
              },
            },
          },
          {
            Red: '2',
            Temp: {
              Green: [
                {
                  name: 'Green',
                  age: '26',
                },
              ],
            },
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin',
              },
            },
          },
        ]);
      });

      it('should support a custom delimiter for the array properties (comma by default)', () => {
        expect(
          csvRowsToObjects(
            [
              ['Red', 'Green[]', 'Blue.forty.goodTimes'],
              ['1', 'Lemmy;Cheddar;Iron Maiden', 'Ronnie James'],
              ['2', 'Koolaid;Hawaiian Punch', 'Peter Griffin'],
            ],
            { listDelimiter: ';' }
          )
        ).toEqual([
          {
            Red: '1',
            Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James',
              },
            },
          },
          {
            Red: '2',
            Green: ['Koolaid', 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin',
              },
            },
          },
        ]);
      });

      it('should be able to parse floats if the option is set (off by default)', () => {
        expect(
          csvRowsToObjects(
            [
              ['Red', 'Green[]', 'Blue.forty.goodTimes'],
              ['1', 'Lemmy,Cheddar,Iron Maiden', 'Ronnie James'],
              ['2', 'Koolaid,52.25,Hawaiian Punch', 'Peter Griffin'],
            ],
            { parseFloats: true }
          )
        ).toEqual([
          {
            Red: 1,
            Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James',
              },
            },
          },
          {
            Red: 2,
            Green: ['Koolaid', 52.25, 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin',
              },
            },
          },
        ]);
      });

      it('should trim the values in the rows (off by default)', () => {
        expect(
          csvRowsToObjects(
            [
              ['Red', 'Green[]', 'Blue.forty.goodTimes'],
              ['1  ', ' Iron Maiden ', 'Ronnie James'],
              ['2', ' Koolaid,Hawaiian Punch ', 'Peter Griffin'],
            ],
            { trimValues: true }
          )
        ).toEqual([
          {
            Red: '1',
            Green: ['Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James',
              },
            },
          },
          {
            Red: '2',
            Green: ['Koolaid', 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin',
              },
            },
          },
        ]);
      });

      it('should play nice with a mix of options', () => {
        expect(
          csvRowsToObjects(
            [
              ['Red', 'Green[]', ' Blue.forty.goodTimes'],
              ['1', ' Lemmy,Cheddar,Iron Maiden', ' Ronnie James'],
              ['2', 'Koolaid,52.25,Hawaiian Punch ', ' Peter Griffin'],
            ],
            {
              parseFloats: true,
              trimValues: true,
            }
          )
        ).toEqual([
          {
            Red: 1,
            Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James',
              },
            },
          },
          {
            Red: 2,
            Green: ['Koolaid', 52.25, 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin',
              },
            },
          },
        ]);
      });
    });
  });

  describe('objectsToCsvRows()', () => {
    it('should return an empty array if passed undefined', () => {
      // @ts-ignore
      expect(objectsToCsvRows(undefined)).toEqual([]);
    });

    it('should return an empty array if passed null', () => {
      // @ts-ignore
      expect(objectsToCsvRows(null)).toEqual([]);
    });

    it('should return an empty array if passed an empty array', () => {
      expect(objectsToCsvRows([])).toEqual([]);
    });

    it('should return the header row and a single content row if passed a single object', () => {
      expect(
        objectsToCsvRows({
          red: 27,
          green: 'Hello',
        })
      ).toEqual([
        ['red', 'green'],
        [27, 'Hello'],
      ]);
    });

    it('should return the header row and all the rows if passed an array of objects', () => {
      expect(
        objectsToCsvRows([
          {
            Red: '1',
            Green: 'Lemmy',
            Blue: 'Ronnie James',
          },
          {
            Red: '2',
            Green: 'Koolaid',
            Blue: 'Peter Griffin',
          },
        ])
      ).toEqual([
        ['Red', 'Green', 'Blue'],
        ['1', 'Lemmy', 'Ronnie James'],
        ['2', 'Koolaid', 'Peter Griffin'],
      ]);
    });

    it('should assemble header using the master list of all properties from all objects', () => {
      expect(
        objectsToCsvRows([
          {
            Red: '1',
            Green: 'Lemmy',
            Blue: 'Ronnie James',
            Purple: 42,
          },
          {
            Red: '2',
            Green: 'Koolaid',
            Blue: 'Peter Griffin',
            Maroon: 88,
          },
        ])
      ).toEqual([
        ['Red', 'Green', 'Blue', 'Purple', 'Maroon'],
        ['1', 'Lemmy', 'Ronnie James', 42, ''],
        ['2', 'Koolaid', 'Peter Griffin', '', 88],
      ]);
    });

    it('should play nice with 0 as a numeric value in the row', () => {
      expect(
        objectsToCsvRows([
          {
            Red: '1',
            Green: 0,
            Blue: 'Ronnie James',
            Purple: 42,
          },
          {
            Red: 0,
            Green: 'Koolaid',
            Blue: 'Peter Griffin',
            Maroon: 88,
          },
        ])
      ).toEqual([
        ['Red', 'Green', 'Blue', 'Purple', 'Maroon'],
        ['1', 0, 'Ronnie James', 42, ''],
        [0, 'Koolaid', 'Peter Griffin', '', 88],
      ]);
    });

    it('should properly map dot properties out to rows', () => {
      expect(
        objectsToCsvRows([
          {
            Red: '1',
            Green: 'Lemmy',
            Blue: {
              forty: {
                goodTimes: 'Ronnie James',
              },
            },
          },
          {
            Red: '2',
            Green: 'Koolaid',
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin',
              },
            },
          },
        ])
      ).toEqual([
        ['Red', 'Green', 'Blue.forty.goodTimes'],
        ['1', 'Lemmy', 'Ronnie James'],
        ['2', 'Koolaid', 'Peter Griffin'],
      ]);
    });

    it('should properly map array properties out to rows', () => {
      expect(
        objectsToCsvRows([
          {
            Red: '1',
            Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
            Blue: {
              forty: {
                goodTimes: 'Ronnie James',
              },
            },
          },
          {
            Red: '2',
            Green: ['Koolaid', 'Hawaiian Punch'],
            Blue: {
              forty: {
                goodTimes: 'Peter Griffin',
              },
            },
          },
        ])
      ).toEqual([
        ['Red', 'Green[]', 'Blue.forty.goodTimes'],
        ['1', 'Lemmy,Cheddar,Iron Maiden', 'Ronnie James'],
        ['2', 'Koolaid,Hawaiian Punch', 'Peter Griffin'],
      ]);
    });

    describe('options', () => {
      it('should support query string based objects in the array content cells with an option set (off by default)', () => {
        expect(
          objectsToCsvRows(
            [
              {
                Red: '1',
                Green: [
                  {
                    name: 'Iron Maiden',
                    age: '51',
                  },
                  {
                    name: 'Motorhead',
                    age: '55',
                  },
                ],
                Blue: {
                  forty: {
                    goodTimes: 'Ronnie James',
                  },
                },
              },
              {
                Red: '2',
                Green: [
                  {
                    name: 'Green',
                    age: '26',
                  },
                ],
                Blue: {
                  forty: {
                    goodTimes: 'Peter Griffin',
                  },
                },
              },
            ],
            { queryStringsToObjects: true }
          )
        ).toEqual([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          [
            '1',
            'name=Iron%20Maiden&age=51,name=Motorhead&age=55',
            'Ronnie James',
          ],
          ['2', 'name=Green&age=26', 'Peter Griffin'],
        ]);
      });

      it('should support json object in the array content cells with an option set (off by default)', () => {
        expect(
          objectsToCsvRows(
            [
              {
                Red: '1',
                Temp: {
                  Green: [
                    {
                      name: 'Iron Maiden',
                      age: '51',
                    },
                    {
                      name: 'Motorhead',
                      age: '55',
                    },
                  ],
                },
                Blue: {
                  forty: {
                    goodTimes: 'Ronnie James',
                  },
                },
              },
              {
                Red: '2',
                Temp: {
                  Green: [
                    {
                      name: 'Green',
                      age: '26',
                    },
                  ],
                },
                Blue: {
                  forty: {
                    goodTimes: 'Peter Griffin',
                  },
                },
              },
            ],
            { jsonStringsToObjects: true }
          )
        ).toEqual([
          ['Red', 'Temp.Green[]', 'Blue.forty.goodTimes'],
          [
            '1',
            '{"name":"Iron Maiden","age":"51"},{"name":"Motorhead","age":"55"}',
            'Ronnie James',
          ],
          ['2', '{"name":"Green","age":"26"}', 'Peter Griffin'],
        ]);
      });

      it('should support a custom delimiter for array values (comma by default)', () => {
        expect(
          objectsToCsvRows(
            [
              {
                Red: '1',
                Green: ['Lemmy', 'Cheddar', 'Iron Maiden'],
                Blue: {
                  forty: {
                    goodTimes: 'Ronnie James',
                  },
                },
              },
              {
                Red: '2',
                Green: ['Koolaid', 'Hawaiian Punch'],
                Blue: {
                  forty: {
                    goodTimes: 'Peter Griffin',
                  },
                },
              },
            ],
            { listDelimiter: ';' }
          )
        ).toEqual([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          ['1', 'Lemmy;Cheddar;Iron Maiden', 'Ronnie James'],
          ['2', 'Koolaid;Hawaiian Punch', 'Peter Griffin'],
        ]);
      });

      it('should play nice with a mix of options', () => {
        expect(
          objectsToCsvRows(
            [
              {
                Red: '1',
                Green: [
                  {
                    name: 'Iron Maiden',
                    age: '51',
                  },
                  {
                    name: 'Motorhead',
                    age: '55',
                  },
                ],
                Blue: {
                  forty: {
                    goodTimes: 'Ronnie James',
                  },
                },
              },
              {
                Red: '2',
                Green: [
                  {
                    name: 'Green',
                    age: '26',
                  },
                ],
                Blue: {
                  forty: {
                    goodTimes: 'Peter Griffin',
                  },
                },
              },
            ],
            { queryStringsToObjects: true, listDelimiter: ';' }
          )
        ).toEqual([
          ['Red', 'Green[]', 'Blue.forty.goodTimes'],
          [
            '1',
            'name=Iron%20Maiden&age=51;name=Motorhead&age=55',
            'Ronnie James',
          ],
          ['2', 'name=Green&age=26', 'Peter Griffin'],
        ]);
      });
    });
  });
});
