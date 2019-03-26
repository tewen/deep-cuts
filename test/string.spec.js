const { expect } = require('chai');

const { stringToBoolean, escapeForRegExp } = require('../');

describe('string', function () {
  describe('stringToBoolean()', function () {
    it('should return false if passed false', function () {
      expect(stringToBoolean(false)).to.be.false;
    });

    it('should return false if passed the string \'false\'', function () {
      expect(stringToBoolean('false')).to.be.false;
    });

    it('should return false if passed 0', function () {
      expect(stringToBoolean(0)).to.be.false;
    });

    it('should return false if passed the string \'0\'', function () {
      expect(stringToBoolean('0')).to.be.false;
    });

    it('should return false if passed undefined', function () {
      expect(stringToBoolean(undefined)).to.be.false;
    });

    it('should return false if passed the string \'undefined\'', function () {
      expect(stringToBoolean('undefined')).to.be.false;
    });

    it('should return false if passed null', function () {
      expect(stringToBoolean(null)).to.be.false;
    });

    it('should return false if passed the string \'null\'', function () {
      expect(stringToBoolean('null')).to.be.false;
    });

    it('should return false if passed a blank string', function () {
      expect(stringToBoolean('')).to.be.false;
    });

    it('should return true if passed true', function () {
      expect(stringToBoolean(true)).to.be.true;
    });

    it('should return true if passed any non falsey string', function () {
      expect(stringToBoolean('Nachos')).to.be.true;
    });

    it('should return true if passed any non falsey number', function () {
      expect(stringToBoolean(2)).to.be.true;
    });

    it('should return true if passed any non falsey object', function () {
      expect(stringToBoolean({})).to.be.true;
    });
  });

  describe('escapeForRegExp()', function () {
    it('should return undefined if passed undefined', function () {
      expect(escapeForRegExp(undefined)).to.be.undefined;
    });

    it('should return null if passed null', function () {
      expect(escapeForRegExp(null)).to.be.null;
    });

    it('should return a blank string if passed a blank string', function () {
      expect(escapeForRegExp('')).to.eql('');
    });

    it('should return a string unmodified if there are no special characters', function () {
      expect(escapeForRegExp('T Rex Tea Time')).to.eql('T Rex Tea Time');
    });

    it('should escape [', function () {
      expect(escapeForRegExp('Happy [ Times')).to.eql('Happy \\[ Times');
    });

    it('should escape ]', function () {
      expect(escapeForRegExp('Happy ] Times')).to.eql('Happy \\] Times');
    });

    it('should escape -', function () {
      expect(escapeForRegExp('T-Rex Tea Time')).to.eql('T\\-Rex Tea Time');
    });

    it('should escape \\', function () {
      expect(escapeForRegExp('22 \\ 67')).to.eql('22 \\\\ 67');
    });

    it('should escape /', function () {
      expect(escapeForRegExp('0 / 11')).to.eql('0 \\/ 11');
    });

    it('should escape ^', function () {
      expect(escapeForRegExp('My Hat^')).to.eql('My Hat\\^');
    });

    it('should escape $', function () {
      expect(escapeForRegExp('$25')).to.eql('\\$25');
    });

    it('should escape *', function () {
      expect(escapeForRegExp('BAD W*RD')).to.eql('BAD W\\*RD');
    });

    it('should escape +', function () {
      expect(escapeForRegExp('4 + 4')).to.eql('4 \\+ 4');
    });

    it('should escape ?', function () {
      expect(escapeForRegExp('Can I ask a question?')).to.eql('Can I ask a question\\?');
    });

    it('should escape .', function () {
      expect(escapeForRegExp('25.64')).to.eql('25\\.64');
    });

    it('should escape (', function () {
      expect(escapeForRegExp('77(88')).to.eql('77\\(88');
    });

    it('should escape )', function () {
      expect(escapeForRegExp('77)88')).to.eql('77\\)88');
    });

    it('should escape |', function () {
      expect(escapeForRegExp('||H')).to.eql('\\|\\|H');
    });

    it('should escape {', function () {
      expect(escapeForRegExp('class Cheese {}')).to.eql('class Cheese \\{\\}');
    });

    it('should escape }', function () {
      expect(escapeForRegExp('class Cheese {}')).to.eql('class Cheese \\{\\}');
    });

    it('should escape a combination of special characters', function () {
      expect(escapeForRegExp('function test() { return 5 * 5; }')).to.eql('function test\\(\\) \\{ return 5 \\* 5; \\}');
    });
  });
});
