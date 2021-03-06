const chai = require('chai');
const { expect } = chai;
const { getValue, setValue } = require('../lib/internal');

describe('internal', () => {
  describe('getValue()', () => {
    it('should return the default value if passed a nil primitive', () => {
      expect(getValue(null, 'name', 'Steve')).to.equal('Steve');
    });

    it('should return the default value if the key path cannot be found', () => {
      expect(getValue({ color: {} }, 'color.shade', 'Dark')).to.equal('Dark');
    });

    it('should return the default value when the value is found to be undefined', () => {
      expect(getValue({ color: { shade: undefined } }, 'color.shade', 'Dark')).to.equal('Dark');
    });

    it('should not return the default value over a falsey value that is found', () => {
      expect(getValue({ color: { shade: null } }, 'color.shade', 'Dark')).to.be.null;
    });

    it('should be able to find key paths in arrays', () => {
      expect(getValue({ color: { shade: ['Light', 'Medium'] } }, 'color.shade.1', 'Dark')).to.equal('Medium');
    });

    it('should play nice with array syntax in key paths', () => {
      expect(getValue({ color: { shade: ['Light', 'Medium'] } }, 'color.shade.[1]', 'Dark')).to.equal('Medium');
    });

    it('should be able to find a key path from an array at the top level', () => {
      expect(getValue([{ name: 'Mike' }, { name: 'George' }], '1.name')).to.equal('George');
      expect(getValue([{ name: 'Mike' }, { name: 'George' }], '[0].name')).to.equal('Mike');
    });

    it('should be able to find a key path in an object, into an array, and into another object', () => {
      expect(getValue({ color: { shade: [{ type: 'Light' }, { type: 'Medium' }] } }, 'color.shade.[0].type', 'Dark')).to.equal('Light');
      expect(getValue({ color: { shade: [{ type: 'Light' }, { type: 'Medium' }] } }, 'color.shade.0.type', 'Dark')).to.equal('Light');
    });

    it('should play nice with this object from the csv spec', () => {
      const obj = {
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
      };
      expect(getValue(obj, 'Green[]', '')).to.eql([{
        name: 'Green',
        age: '26'
      }]);
      expect(getValue(obj, 'Blue.forty.goodTimes', '')).to.eql('Peter Griffin');
    });
  });

  describe('setValue()', () => {
    it('should return the modified object', () => {
      expect(setValue({}, 'name.first', 'Jerry')).to.eql({ name: { first: 'Jerry' } });
    });

    it('should modify the original object', () => {
      const obj = {};
      const res = setValue(obj, 'color.shade', 'Dark');
      expect(obj).to.equal(res);
      expect(obj).to.eql({ color: { shade: 'Dark' } });
    });

    it('should play nice with arrays', () => {
      expect(setValue([1, 2, 3], '2', 7)).to.eql([1, 2, 7]);
    });

    it('should play nice with arrays and brackets', () => {
      expect(setValue([1, 2, 3], '[1]', 17)).to.eql([1, 17, 3]);
    });

    it('should play nice with deep array properties', () => {
      expect(setValue([{}, {}, {}], '[1].flavor.strawberry', true)).to.eql([{}, { flavor: { strawberry: true } }, {}]);
    });
  });
});
