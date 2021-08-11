import { parseFloatOrUndefined, parseIntegerOrUndefined } from '../';

describe('number', () => {
  describe('parseFloatOrUndefined()', () => {
    it('should return undefined if passed undefined', () => {
      expect(parseFloatOrUndefined(undefined)).toBeUndefined();
    });

    it('should return undefined if passed null', () => {
      expect(parseFloatOrUndefined(null)).toBeUndefined();
    });

    it('should return undefined if passed a blank string', () => {
      expect(parseFloatOrUndefined('')).toBeUndefined();
    });

    it('should return undefined if passed a string that is not a float', () => {
      expect(parseFloatOrUndefined('Koolaid')).toBeUndefined();
    });

    it('should return undefined if passed a float that is not easily parsed', () => {
      expect(parseFloatOrUndefined('15,650')).toBeUndefined();
    });

    it('should return a parsed float if passed a float', () => {
      expect(parseFloatOrUndefined(22.67)).toBe(22.67);
    });

    it('should return a parsed float if passed an integer', () => {
      expect(parseFloatOrUndefined(-5)).toBe(-5);
    });

    it('should return a parsed float if passed a string that is a valid float representation', () => {
      expect(parseFloatOrUndefined('25.624')).toBe(25.624);
    });

    it('should return a parsed float if passed a string that is a valid integer representation', () => {
      expect(parseFloatOrUndefined('105')).toBe(105);
    });
  });

  describe('parseIntegerOrUndefined()', () => {
    it('should return undefined if passed undefined', () => {
      expect(parseIntegerOrUndefined(undefined)).toBeUndefined();
    });

    it('should return undefined if passed null', () => {
      expect(parseIntegerOrUndefined(null)).toBeUndefined();
    });

    it('should return undefined if passed a blank string', () => {
      expect(parseIntegerOrUndefined('')).toBeUndefined();
    });

    it('should return undefined if passed a string that is not a float', () => {
      expect(parseIntegerOrUndefined('Hamster Wheel')).toBeUndefined();
    });

    it('should return undefined if passed an integer that is not easily parsed', () => {
      expect(parseIntegerOrUndefined('$67')).toBeUndefined();
      expect(parseIntegerOrUndefined('22oo')).toBeUndefined();
    });

    it('should return a parsed integer if passed a float', () => {
      expect(parseIntegerOrUndefined(78.9534)).toBe(78);
    });

    it('should return a parsed integer if passed an integer', () => {
      expect(parseIntegerOrUndefined(-220)).toBe(-220);
    });

    it('should return a parsed integer if passed a string that is a valid float representation', () => {
      expect(parseIntegerOrUndefined('-45.0829')).toBe(-45);
    });

    it('should return a parsed integer if passed a string that is a valid integer representation', () => {
      expect(parseIntegerOrUndefined('32500')).toBe(32500);
    });
  });
});
