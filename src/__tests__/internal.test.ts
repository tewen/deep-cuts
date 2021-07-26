import { getValue, setValue } from '../internal';

describe('internal', () => {
  describe('getValue()', () => {
    it('should return the default value if passed a nil primitive', () => {
      // @ts-ignore
      expect(getValue(null, 'name', 'Steve')).toEqual('Steve');
    });

    it('should return the default value if the key path cannot be found', () => {
      expect(getValue({ color: {} }, 'color.shade', 'Dark')).toEqual('Dark');
    });

    it('should return the default value when the value is found to be undefined', () => {
      expect(
        getValue({ color: { shade: undefined } }, 'color.shade', 'Dark')
      ).toEqual('Dark');
    });

    it('should not return the default value over a falsey value that is found', () => {
      expect(
        getValue({ color: { shade: null } }, 'color.shade', 'Dark')
      ).toBeNull();
    });

    it('should be able to find key paths in arrays', () => {
      expect(
        getValue(
          { color: { shade: ['Light', 'Medium'] } },
          'color.shade.1',
          'Dark'
        )
      ).toEqual('Medium');
    });

    it('should play nice with array syntax in key paths', () => {
      expect(
        getValue(
          { color: { shade: ['Light', 'Medium'] } },
          'color.shade.[1]',
          'Dark'
        )
      ).toEqual('Medium');
    });

    it('should be able to find a key path from an array at the top level', () => {
      expect(
        getValue([{ name: 'Mike' }, { name: 'George' }], '1.name')
      ).toEqual('George');
      expect(
        getValue([{ name: 'Mike' }, { name: 'George' }], '[0].name')
      ).toEqual('Mike');
    });

    it('should be able to find a key path in an object, into an array, and into another object', () => {
      expect(
        getValue(
          { color: { shade: [{ type: 'Light' }, { type: 'Medium' }] } },
          'color.shade.[0].type',
          'Dark'
        )
      ).toEqual('Light');
      expect(
        getValue(
          { color: { shade: [{ type: 'Light' }, { type: 'Medium' }] } },
          'color.shade.0.type',
          'Dark'
        )
      ).toEqual('Light');
    });

    it('should play nice with this object from the csv spec', () => {
      const obj = {
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
      };
      expect(getValue(obj, 'Green[]', '')).toEqual([
        {
          name: 'Green',
          age: '26',
        },
      ]);
      expect(getValue(obj, 'Blue.forty.goodTimes', '')).toEqual(
        'Peter Griffin'
      );
    });
  });

  describe('setValue()', () => {
    it('should return the modified object', () => {
      expect(setValue({}, 'name.first', 'Jerry')).toEqual({
        name: { first: 'Jerry' },
      });
    });

    it('should modify the original object', () => {
      const obj = {};
      const res = setValue(obj, 'color.shade', 'Dark');
      expect(obj).toEqual(res);
      expect(obj).toEqual({ color: { shade: 'Dark' } });
    });

    it('should play nice with arrays', () => {
      expect(setValue([1, 2, 3], '2', 7)).toEqual([1, 2, 7]);
    });

    it('should play nice with arrays and brackets', () => {
      expect(setValue([1, 2, 3], '[1]', 17)).toEqual([1, 17, 3]);
    });

    it('should play nice with deep array properties', () => {
      expect(setValue([{}, {}, {}], '[1].flavor.strawberry', true)).toEqual([
        {},
        { flavor: { strawberry: true } },
        {},
      ]);
    });
  });
});
