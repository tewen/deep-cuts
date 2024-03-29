import {
  camelCaseToTitleCase,
  cleanSpecialCharacters,
  ifNotNilString,
  stringToBoolean,
  escapeForRegExp,
} from '../';

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

  describe('camelCaseToTitleCase()', () => {
    it('should return an empty string if passed undefined', () => {
      // @ts-ignore
      expect(camelCaseToTitleCase(undefined)).toBe('');
    });

    it('should return an empty string if passed null', () => {
      // @ts-ignore
      expect(camelCaseToTitleCase(null)).toBe('');
    });

    it('should return an empty string if passed an empty string', () => {
      expect(camelCaseToTitleCase('')).toBe('');
    });

    it('should make a camel case string title case', () => {
      expect(camelCaseToTitleCase('iAmACamelHearMeRoar')).toBe(
        'I Am A Camel Hear Me Roar'
      );
    });

    it('should have no effect on snake case strings', () => {
      expect(camelCaseToTitleCase('i_am_a_camel_hear_me_roar')).toBe(
        'i_am_a_camel_hear_me_roar'
      );
      expect(camelCaseToTitleCase('I_Am_A_Camel_Hear_Me_Roar')).toBe(
        'I_Am_A_Camel_Hear_Me_Roar'
      );
    });

    it('should have no effect on kebab case strings', () => {
      expect(camelCaseToTitleCase('ng-component-style')).toBe(
        'ng-component-style'
      );
    });

    it('should have no effect on title case strings', () => {
      expect(camelCaseToTitleCase('Dear Dr. Pennyfarthing')).toBe(
        'Dear Dr. Pennyfarthing'
      );
      expect(camelCaseToTitleCase('Kooltown')).toBe('Kooltown');
    });

    it('should have no effect on camel case strings mixed with other types (Kebab, Title, Snake)', () => {
      expect(camelCaseToTitleCase('iAmACamel-HearMeRoar')).toBe(
        'iAmACamel-HearMeRoar'
      );
      expect(camelCaseToTitleCase('i_AmACamelHearMeRoar')).toBe(
        'i_AmACamelHearMeRoar'
      );
      expect(camelCaseToTitleCase('iAmACamel HearMeRoar')).toBe(
        'iAmACamel HearMeRoar'
      );
    });
  });

  describe('escapeForRegExp()', () => {
    it('should return undefined if passed undefined', () => {
      // @ts-ignore
      expect(escapeForRegExp(undefined)).toBeUndefined();
    });

    it('should return null if passed null', () => {
      // @ts-ignore
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

  describe('cleanSpecialCharacters()', () => {
    it('should return an empty string if passed undefined', () => {
      // @ts-ignore
      expect(cleanSpecialCharacters(undefined)).toEqual('');
    });

    it('should return an empty string if passed null', () => {
      // @ts-ignore
      expect(cleanSpecialCharacters(null)).toEqual('');
    });

    it('should return an empty string if passed an empty string', () => {
      expect(cleanSpecialCharacters('')).toEqual('');
    });

    it('should return a string with no special characters as-is', () => {
      expect(cleanSpecialCharacters('Koolaid, Punch, Results.xlsx')).toEqual(
        'Koolaid, Punch, Results.xlsx'
      );
    });

    it('should return a string with no special characters as-is, even if all spaces', () => {
      expect(cleanSpecialCharacters('    ')).toEqual('    ');
    });

    it('should play nice with numbers', () => {
      // @ts-ignore
      expect(cleanSpecialCharacters(25.624)).toEqual('25.624');
    });

    it('should play nice with numbers in a string', () => {
      expect(cleanSpecialCharacters('56 Signs.pdf')).toEqual('56 Signs.pdf');
    });

    it('should play nice with punctuation', () => {
      expect(
        cleanSpecialCharacters('Reginald. Sr. Officer of the war $5.00')
      ).toEqual('Reginald. Sr. Officer of the war $5.00');
    });

    it('should remove all characters with unicode code above 127', () => {
      expect(
        cleanSpecialCharacters(
          `Hello, ${String.fromCharCode(890)} my name is ${String.fromCharCode(
            129
          )}hill`
        )
      ).toEqual('Hello,  my name is hill');
    });

    it('should be able to specify a replacement for unicode characters above 127', () => {
      expect(
        cleanSpecialCharacters(
          `Hello, ${String.fromCharCode(1200)} my name is ${String.fromCharCode(
            135
          )}hill`,
          'X'
        )
      ).toEqual('Hello, X my name is Xhill');
    });

    it('should play nice with characters right at the edge', () => {
      expect(
        cleanSpecialCharacters(
          [
            String.fromCharCode(50),
            String.fromCharCode(60),
            String.fromCharCode(126),
          ].join('')
        )
      ).toEqual('2<~');
    });
  });

  describe('ifNotNilString()', () => {
    it('should return null if passed undefined', () => {
      expect(ifNotNilString(undefined)).toBeNull();
    });

    it('should return null if passed null', () => {
      expect(ifNotNilString(null)).toBeNull();
    });

    it('should return null if passed NaN', () => {
      expect(ifNotNilString(NaN)).toBeNull();
    });

    it("should return null if passed 'undefined'", () => {
      expect(ifNotNilString('undefined')).toBeNull();
    });

    it("should return null if passed 'null'", () => {
      expect(ifNotNilString('null')).toBeNull();
    });

    it("should return null if passed 'NaN'", () => {
      expect(ifNotNilString('NaN')).toBeNull();
    });

    it('should return a blank string if passed a blank string', () => {
      expect(ifNotNilString('')).toBe('');
    });

    it('should return the value if passed a number', () => {
      expect(ifNotNilString(501)).toBe(501);
    });

    it('should return 0 if passed 0', () => {
      expect(ifNotNilString(0)).toBe(0);
    });

    it('should return a string if passed a string', () => {
      expect(ifNotNilString('Ângelo')).toBe('Ângelo');
    });

    it('should return false if passed false', () => {
      expect(ifNotNilString(false)).toBe(false);
    });

    it('should return true if passed true', () => {
      expect(ifNotNilString(true)).toBe(true);
    });

    it('should return an empty object if passed an empty object', () => {
      const obj = {};
      expect(ifNotNilString(obj)).toBe(obj);
    });

    it('should return an empty array if passed one', () => {
      const ar: any[] = [];
      expect(ifNotNilString(ar)).toBe(ar);
    });
  });
});
