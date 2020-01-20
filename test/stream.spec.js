const chai = require('chai');
const { expect } = chai;
const fs = require('fs');
const path = require('path');

const { jsonStreamToObject } = require('../');

chai.use(require('sinon-chai'));

describe('stream', function () {
  describe('jsonStreamToObject()', function() {
    it('should play nice with a stringified JSON object', async function () {
      const obj = await jsonStreamToObject(fs.createReadStream(path.join(__dirname, 'fixtures/object.json')));
      expect(obj).to.eql({
          city: 'Lerum',
          state: 'O',
          country: 'Portugal',
          address: '1396 Aliquam St.'
        }
      );
    });

    it('should play nice with a stringified JSON array', async function () {
      const array = await jsonStreamToObject(fs.createReadStream(path.join(__dirname, 'fixtures/array.json')));
      expect(array).to.eql([
        {
          city: 'Istanbul',
          state: 'Ist',
          country: 'Maldives',
          address: 'Ap #216-6849 Dapibus Av.'
        },
        {
          city: 'Lerum',
          state: 'O',
          country: 'Portugal',
          address: '1396 Aliquam St.'
        },
        {
          city: 'San Francisco',
          state: 'Heredia',
          country: 'Marshall Islands',
          address: '2582 Non Road'
        }
      ]);
    });

    it('should throw an error for JSON that does not parse, correctly', async function () {
      try {
        await await jsonStreamToObject(fs.createReadStream(path.join(__dirname, 'fixtures/bad.json')));
      } catch (e) {
        expect(e.message).to.eql('Stream did not resolve to a JSON object, you may need to process it another way.');
      }
    });
  });
});
