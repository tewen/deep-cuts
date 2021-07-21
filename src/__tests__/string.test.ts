const { stringToBoolean, escapeForRegExp } = require('../');

describe('string', () => {
  describe('stringToBoolean()', () => {
    it('should return false if passed false', () => {
      expect(stringToBoolean(false)).toBe(false);
    });

    it("should return false if passed the string 'false'", () => {
      expect(stringToBoolean('false')).toBe(false);
    });

    it('should return false if passed 0', () => {
      expect(stringToBoolean(0)).toBe(false);
    });

    it("should return false if passed the string '0'", () => {
      expect(stringToBoolean('0')).toBe(false);
    });

    it('should return false if passed undefined', () => {
      expect(stringToBoolean(undefined)).toBe(false);
    });

    it("should return false if passed the string 'undefined'", () => {
      expect(stringToBoolean('undefined')).toBe(false);
    });

    it('should return false if passed null', () => {
      expect(stringToBoolean(null)).toBe(false);
    });

    it("should return false if passed the string 'null'", () => {
      expect(stringToBoolean('null')).toBe(false);
    });

    it('should return false if passed a blank string', () => {
      expect(stringToBoolean('')).toBe(false);
    });

    it('should return true if passed true', () => {
      expect(stringToBoolean(true)).toBe(true);
    });

    it('should return true if passed any non falsey string', () => {
      expect(stringToBoolean('Nachos')).toBe(true);
    });

    it('should return true if passed any non falsey number', () => {
      expect(stringToBoolean(2)).toBe(true);
    });

    it('should return true if passed any non falsey object', () => {
      expect(stringToBoolean({})).toBe(true);
    });
  });

  describe('escapeForRegExp()', () => {
    it('should return undefined if passed undefined', () => {
      expect(escapeForRegExp(undefined)).toBeUndefined();
    });

    it('should return null if passed null', () => {
      expect(escapeForRegExp(null)).toBeNull();
    });

    it('should return a blank string if passed a blank string', () => {
      expect(escapeForRegExp('')).toEqual('');
    });

    it('should return a string unmodified if there are no special characters', () => {
      expect(escapeForRegExp('T Rex Tea Time')).toEqual('T Rex Tea Time');
    });

    it('should escape [', () => {
      expect(escapeForRegExp('Happy [ Times')).toEqual('Happy \\[ Times');
    });

    it('should escape ]', () => {
      expect(escapeForRegExp('Happy ] Times')).toEqual('Happy \\] Times');
    });

    it('should escape -', () => {
      expect(escapeForRegExp('T-Rex Tea Time')).toEqual('T\\-Rex Tea Time');
    });

    it('should escape \\', () => {
      expect(escapeForRegExp('22 \\ 67')).toEqual('22 \\\\ 67');
    });

    it('should escape /', () => {
      expect(escapeForRegExp('0 / 11')).toEqual('0 \\/ 11');
    });

    it('should escape ^', () => {
      expect(escapeForRegExp('My Hat^')).toEqual('My Hat\\^');
    });

    it('should escape $', () => {
      expect(escapeForRegExp('$25')).toEqual('\\$25');
    });

    it('should escape *', () => {
      expect(escapeForRegExp('BAD W*RD')).toEqual('BAD W\\*RD');
    });

    it('should escape +', () => {
      expect(escapeForRegExp('4 + 4')).toEqual('4 \\+ 4');
    });

    it('should escape ?', () => {
      expect(escapeForRegExp('Can I ask a question?')).toEqual(
        'Can I ask a question\\?'
      );
    });

    it('should escape .', () => {
      expect(escapeForRegExp('25.64')).toEqual('25\\.64');
    });

    it('should escape (', () => {
      expect(escapeForRegExp('77(88')).toEqual('77\\(88');
    });

    it('should escape )', () => {
      expect(escapeForRegExp('77)88')).toEqual('77\\)88');
    });

    it('should escape |', () => {
      expect(escapeForRegExp('||H')).toEqual('\\|\\|H');
    });

    it('should escape {', () => {
      expect(escapeForRegExp('class Cheese {}')).toEqual('class Cheese \\{\\}');
    });

    it('should escape }', () => {
      expect(escapeForRegExp('class Cheese {}')).toEqual('class Cheese \\{\\}');
    });

    it('should escape a combination of special characters', () => {
      expect(escapeForRegExp('function test() { return 5 * 5; }')).toEqual(
        'function test\\(\\) \\{ return 5 \\* 5; \\}'
      );
    });
  });
});
