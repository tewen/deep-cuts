const { expect } = require('chai');

const { safeJsonParse } = require('../');

describe('json', function() {
  describe('safeJsonParse()', function () {
    it('should return null if passed undefined', function () {
      expect(safeJsonParse(undefined)).to.be.null;
    });

    it('should return null if passed null', function () {
      expect(safeJsonParse(null)).to.be.null;
    });

    it('should return null if passed an invalid JSON string', function () {
      expect(safeJsonParse('My name is Steve')).to.be.null;
    });

    it('should be able to parse stringified JSON', function () {
      expect(safeJsonParse(JSON.stringify({
        red: true,
        blue: 10
      }))).to.eql({
        red: true,
        blue: 10
      });
    });
  });
});
