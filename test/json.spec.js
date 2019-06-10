const { expect } = require('chai');

const { isJsonString, safeJsonParse } = require('../');

describe('json', function () {
  describe('isJsonString()', function () {
    it('should return false if passed undefined', function () {
      expect(isJsonString(undefined)).to.be.false;
    });

    it('should return false if passed null', function () {
      expect(isJsonString(null)).to.be.false;
    });

    it('should return false if passed a blank string', function () {
      expect(isJsonString('')).to.be.false;
    });

    it('should return false if passed a number', function () {
      expect(isJsonString(555)).to.be.false;
    });

    it('should return false if passed an invalid json object string', function () {
      expect(isJsonString('{"red":5,"green":55,"blue":Koolaid"}')).to.be.false;
    });

    it('should return false if passed an invalid json array string', function () {
      expect(isJsonString('["Red","Green","Blue"')).to.be.false;
    });

    it('should return true if passed a valid json object string', function () {
      expect(isJsonString('{"red":5,"green":55,"blue":"Koolaid"}')).to.be.true;
    });

    it('should return true if passed a valid json array string', function () {
      expect(isJsonString('["Red","Green","Blue"]')).to.be.true;
    });
  });

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
