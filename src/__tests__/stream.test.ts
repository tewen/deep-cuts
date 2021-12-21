import fs from 'fs';
import path from 'path';
import { jsonStreamToObject } from '../';

describe('stream', () => {
  describe('jsonStreamToObject()', () => {
    it('should play nice with a stringified JSON object', async () => {
      const obj = await jsonStreamToObject(
        fs.createReadStream(path.join(__dirname, 'fixtures/object.json'))
      );
      expect(obj).toEqual({
        city: 'Lerum',
        state: 'O',
        country: 'Portugal',
        address: '1396 Aliquam St.',
      });
    });

    it('should play nice with a stringified JSON array', async () => {
      const array = await jsonStreamToObject(
        fs.createReadStream(path.join(__dirname, 'fixtures/array.json'))
      );
      expect(array).toEqual([
        {
          city: 'Istanbul',
          state: 'Ist',
          country: 'Maldives',
          address: 'Ap #216-6849 Dapibus Av.',
        },
        {
          city: 'Lerum',
          state: 'O',
          country: 'Portugal',
          address: '1396 Aliquam St.',
        },
        {
          city: 'San Francisco',
          state: 'Heredia',
          country: 'Marshall Islands',
          address: '2582 Non Road',
        },
      ]);
    });

    it('should throw an error for JSON that does not parse, correctly', async () => {
      try {
        await await jsonStreamToObject(
          fs.createReadStream(path.join(__dirname, 'fixtures/bad.json'))
        );
      } catch (e) {
        // @ts-ignore
        expect(e.message).toEqual(
          'Stream did not resolve to a JSON object, you may need to process it another way.'
        );
      }
    });
  });
});
