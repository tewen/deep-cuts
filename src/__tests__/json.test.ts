const { isJsonString, safeJsonParse } = require('../');

describe('json', () => {
  describe('isJsonString()', () => {
    it('should return false if passed undefined', () => {
      expect(isJsonString(undefined)).toBe(false);
    });

    it('should return false if passed null', () => {
      expect(isJsonString(null)).toBe(false);
    });

    it('should return false if passed a blank string', () => {
      expect(isJsonString('')).toBe(false);
    });

    it('should return false if passed a number', () => {
      expect(isJsonString(555)).toBe(false);
    });

    it('should return false if passed an invalid json object string', () => {
      expect(isJsonString('{"red":5,"green":55,"blue":Koolaid"}')).toBe(false);
    });

    it('should return false if passed an invalid json array string', () => {
      expect(isJsonString('["Red","Green","Blue"')).toBe(false);
    });

    it('should return true if passed a valid json object string', () => {
      expect(isJsonString('{"red":5,"green":55,"blue":"Koolaid"}')).toBe(true);
    });

    it('should return true if passed a valid json array string', () => {
      expect(isJsonString('["Red","Green","Blue"]')).toBe(true);
    });
  });

  describe('safeJsonParse()', () => {
    it('should return null if passed undefined', () => {
      expect(safeJsonParse(undefined)).toBeNull();
    });

    it('should return null if passed null', () => {
      expect(safeJsonParse(null)).toBeNull();
    });

    it('should return null if passed an invalid JSON string', () => {
      expect(safeJsonParse('My name is Steve')).toBeNull();
    });

    it('should be able to parse stringified JSON', () => {
      expect(
        safeJsonParse(
          JSON.stringify({
            red: true,
            blue: 10,
          })
        )
      ).toEqual({
        red: true,
        blue: 10,
      });
    });
  });
});
