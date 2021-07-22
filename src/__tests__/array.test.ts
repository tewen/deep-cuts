import { timeout } from 'data-mining-tools';
import { tailRecursion } from '../';

describe('array', () => {
  describe('tailRecursion()', () => {
    it('should return an empty array if passed undefined for the collection', async () => {
      // @ts-ignore
      expect(await tailRecursion(undefined, jest.fn())).toEqual([]);
    });

    it('should return an empty array if passed null for the collection', async () => {
      // @ts-ignore
      expect(await tailRecursion(undefined, jest.fn())).toEqual([]);
    });

    it('should return an empty array if passed an empty array for the collection', async () => {
      expect(await tailRecursion([], jest.fn())).toEqual([]);
    });

    it('should return the accumulation of the async functions', async () => {
      expect(
        await tailRecursion([1, 2, 6], async (item: number) => {
          await timeout(1);
          return item + 2;
        })
      ).toEqual([3, 4, 8]);
    });

    it('should be able to seed a payload', async () => {
      expect(
        await tailRecursion(
          ['Koolaid', 'George', 'Omar'],
          async (item: string) => {
            await timeout(1);
            return `${item}+`;
          },
          ['Mike', 'Charles']
        )
      ).toEqual(['Mike', 'Charles', 'Koolaid+', 'George+', 'Omar+']);
    });
  });
});
