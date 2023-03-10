import {
  parseFloatOrUndefined,
  parseIntegerOrUndefined,
  currencyToFloat,
  roundToNearestFraction,
} from '../';

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

  describe('currencyToFloat()', () => {
    it('should return undefined if passed undefined', () => {
      // @ts-ignore
      expect(currencyToFloat(undefined)).toBeUndefined();
    });

    it('should return undefined if passed null', () => {
      // @ts-ignore
      expect(currencyToFloat(null)).toBeUndefined();
    });

    it('should return undefined if passed a blank string', () => {
      expect(currencyToFloat('')).toBeUndefined();
    });

    it('should return undefined if passed NaN', () => {
      expect(currencyToFloat(NaN)).toBeUndefined();
    });

    it('should return undefined if passed a string that is not a valid currency or number', () => {
      expect(currencyToFloat('$how and Tell')).toBeUndefined();
    });

    it('should return the number if passed a number', () => {
      expect(currencyToFloat(55)).toBe(55);
      expect(currencyToFloat(-100.09)).toBe(-100.09);
    });

    it('should convert US currency by default', () => {
      expect(currencyToFloat('$7010.74')).toBe(7010.74);
    });

    it('should be able to convert other currencies', () => {
      expect(currencyToFloat('£11.99', '£')).toBe(11.99);
    });

    it('should play nice with commas', () => {
      expect(currencyToFloat('$102,455,289.74')).toBe(102455289.74);
    });

    it('should not worry about decimal places', () => {
      expect(currencyToFloat('$102,455,289.7401')).toBe(102455289.7401);
    });
  });

  describe('roundToNearestFraction()', () => {
    it('should return undefined if passed undefined', () => {
      // @ts-ignore
      expect(roundToNearestFraction(undefined, 4, 2)).toBeUndefined();
    });

    it('should return null if passed null', () => {
      // @ts-ignore
      expect(roundToNearestFraction(null, 4, 2)).toBeUndefined();
    });

    it('should return 0 if passed 0 in any case', () => {
      expect(roundToNearestFraction(0, 8, 4)).toBe(0);
    });

    it('should return 0 for a stringified 0', () => {
      expect(roundToNearestFraction('0', 8, 4)).toBe(0);
    });

    it('should return a value rounded to the nearest integer if provided 1 for the denominator', () => {
      expect(roundToNearestFraction(25.6278, 1, 4)).toBe(26);
    });

    it('should play nice with negative numbers when 1 is the denominator', () => {
      expect(roundToNearestFraction(-108.87, 1, 2)).toBe(-109);
    });

    it('should play nice with the string versions of 1 in the denominator, negative and positive', () => {
      expect(roundToNearestFraction('25.6278', 1, 4)).toBe(26);
      expect(roundToNearestFraction('-108.87', 1, 2)).toBe(-109);
    });

    it('should round to the nearest half', () => {
      expect(roundToNearestFraction(11.2, 2, 4)).toBe(11);
      expect(roundToNearestFraction(11.4, 2, 4)).toBe(11.5);
    });

    it('should play nice with negatives for the half', () => {
      expect(roundToNearestFraction(-163.108, 2, 4)).toBe(-163);
      expect(roundToNearestFraction(-163.260001, 2, 4)).toBe(-163.5);
    });

    it('should play nice with the string versions of 2 in the denominator, negative and positive', () => {
      expect(roundToNearestFraction('11.2', 2, 4)).toBe(11);
      expect(roundToNearestFraction('11.4', 2, 4)).toBe(11.5);
      expect(roundToNearestFraction('-163.108', 2, 4)).toBe(-163);
      expect(roundToNearestFraction('-163.260001', 2, 4)).toBe(-163.5);
    });

    it('should round to the nearest quarter', () => {
      expect(roundToNearestFraction(1456.27, 4, 2)).toBe(1456.25);
      expect(roundToNearestFraction(1456.47, 4, 2)).toBe(1456.5);
    });

    it('should play nice with negatives for the quarter', () => {
      expect(roundToNearestFraction(-2.0000001, 4, 2)).toBe(-2);
      expect(roundToNearestFraction(-2.249999999999, 4, 2)).toBe(-2.25);
    });

    it('should play nice with the string versions of 4 in the denominator, negative and positive', () => {
      expect(roundToNearestFraction('1456.27', 4, 2)).toBe(1456.25);
      expect(roundToNearestFraction('1456.47', 4, 2)).toBe(1456.5);
      expect(roundToNearestFraction('-2.0000001', 4, 2)).toBe(-2);
      expect(roundToNearestFraction('-2.249999999999', 4, 2)).toBe(-2.25);
    });

    it('should round to the nearest hundredth', () => {
      expect(roundToNearestFraction(20.00501, 100, 3)).toBe(20.01);
      expect(roundToNearestFraction(20.004099999, 100, 3)).toBe(20);
    });

    it('should play nice with negatives for the hundredth', () => {
      expect(roundToNearestFraction(-47.4850000001, 100, 3)).toBe(-47.49);
      expect(roundToNearestFraction(-47.481, 100, 3)).toBe(-47.48);
    });

    it('should play nice with the string versions of 100 in the denominator, negative and positive', () => {
      expect(roundToNearestFraction('20.00501', 100, 3)).toBe(20.01);
      expect(roundToNearestFraction('20.004099999', 100, 3)).toBe(20);
      expect(roundToNearestFraction('-47.4850000001', 100, 3)).toBe(-47.49);
      expect(roundToNearestFraction('-47.481', 100, 3)).toBe(-47.48);
    });

    it('should be able to cut off decimals with the max decimals', () => {
      expect(roundToNearestFraction(-47.4850000001, 100, 1)).toBe(-47.5);
    });
  });
});
