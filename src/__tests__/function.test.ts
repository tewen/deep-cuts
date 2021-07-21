import Mock = jest.Mock;

const { acceptNoArguments, functionOrValue, tryCatch } = require('../');

describe('function', () => {
  describe('acceptNoArguments()', () => {
    let fn: Mock;

    beforeEach(() => {
      fn = jest.fn();
    });

    it('should return a function', () => {
      expect(acceptNoArguments(fn)).toBeInstanceOf(Function);
    });

    it('should return a function that accepts none of the arguments it is called with', () => {
      acceptNoArguments(fn)(0, 1, 2);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn.mock.calls[0][0]).toBeUndefined();
    });

    it('should behave like a partial on initialization, arguments can be provided', () => {
      acceptNoArguments(fn, 3, 4)();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn.mock.calls[0]).toEqual([3, 4]);
    });

    it('should accept no additional arguments than the ones that were provided on initialization', () => {
      acceptNoArguments(fn, 3, 4)(0, 1, 2);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn.mock.calls[0]).toEqual([3, 4]);
    });
  });

  describe('functionOrValue()', () => {
    let fn: Function;

    beforeEach(() => {
      fn = jest.fn().mockReturnValue(55);
    });

    it('should return a non-function nil value if passed', () => {
      expect(functionOrValue(null)).toBeNull();
    });

    it('should return a non-function primitive value of passed', () => {
      expect(functionOrValue(55)).toEqual(55);
    });

    it('should return an object if passed', () => {
      expect(functionOrValue({ name: 'Koolaid' })).toEqual({ name: 'Koolaid' });
    });

    it('should return an array if passed', () => {
      expect(functionOrValue([1, 2, 5])).toEqual([1, 2, 5]);
    });

    it('should call a function even if no additional arguments are passed', () => {
      expect(functionOrValue(fn)).toEqual(55);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call a function with the additional arguments', () => {
      expect(functionOrValue(fn, 44, {}, 'orange')).toEqual(55);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(44, {}, 'orange');
    });

    it('should be able to call cascading functions that return other functions', () => {
      const stub: Mock = jest.fn().mockReturnValue(true);
      fn = () => () => () => stub;
      expect(functionOrValue(fn, 78, [55, 66, 77])).toBe(true);
      expect(stub).toHaveBeenCalledTimes(1);
      expect(stub).toHaveBeenCalledWith(78, [55, 66, 77]);
    });
  });

  describe('tryCatch()', () => {
    let tryFn;
    let catchFn;

    it('should play nice with a sync tryFn', async () => {
      tryFn = jest.fn().mockReturnValue({ success: 500 });
      const { response, error } = await tryCatch(tryFn);
      expect(response).toEqual({ success: 500 });
      expect(error).toBeUndefined();
    });

    it('should play nice with an async tryFn', async () => {
      tryFn = jest.fn().mockReturnValue({ success: 500 });
      const { response, error } = await tryCatch(tryFn);
      expect(response).toEqual({ success: 500 });
      expect(error).toBeUndefined();
    });

    it('should provide the error only in the error part of the response if no catchFn is provided', async () => {
      const err = new Error('Bad thing happened.');
      tryFn = () => {
        throw err;
      };
      const { response, error } = await tryCatch(tryFn);
      expect(response).toBeUndefined();
      expect(error).toEqual(err);
    });

    it('should pass the error through the catchFn if provided', async () => {
      let newErr;
      const err = new Error('Bad thing happened.');
      tryFn = () => {
        throw err;
      };
      const { response, error } = await tryCatch(tryFn, (e: Error) => {
        expect(e).toEqual(err);
        newErr = new Error('Koolaid');
        return newErr;
      });
      expect(response).toBeUndefined();
      expect(error).toEqual(newErr);
    });

    it('should play nice with async catchFn', async () => {
      const err = new Error('Bad thing happened.');
      const newErr = new Error('Less bad thing happened.');
      tryFn = () => {
        throw err;
      };
      catchFn = () => Promise.resolve(newErr);
      const { response, error } = await tryCatch(tryFn, catchFn);
      expect(response).toBeUndefined();
      expect(error).toEqual(newErr);
    });
  });
});
