const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');

const { acceptNoArguments, functionOrValue, tryCatch } = require('../');

chai.use(require('sinon-chai'));

describe('function', function () {
  describe('acceptNoArguments()', function () {
    let fn;

    beforeEach(function () {
      fn = sinon.spy();
    });

    it('should return a function', function () {
      expect(acceptNoArguments(fn)).to.be.an.instanceOf(Function);
    });

    it('should return a function that accepts none of the arguments it is called with', function () {
      acceptNoArguments(fn)(0, 1, 2);
      expect(fn).to.have.been.calledOnce;
      expect(fn.args[0]).to.be.empty;
    });

    it('should behave like a partial on initialization, arguments can be provided', function () {
      acceptNoArguments(fn, 3, 4)();
      expect(fn).to.have.been.calledOnce;
      expect(fn.args[0]).to.be.eql([3, 4]);
    });

    it('should accept no additional arguments than the ones that were provided on initialization', function () {
      acceptNoArguments(fn, 3, 4)(0, 1, 2);
      expect(fn).to.have.been.calledOnce;
      expect(fn.args[0]).to.be.eql([3, 4]);
    });
  });

  describe('functionOrValue()', function () {
    let fn;

    beforeEach(function () {
      fn = sinon.stub().returns(55);
    });

    it('should return a non-function nil value if passed', function () {
      expect(functionOrValue(null)).to.be.null;
    });

    it('should return a non-function primitive value of passed', function () {
      expect(functionOrValue(55)).to.equal(55);
    });

    it('should return an object if passed', function () {
      expect(functionOrValue({ name: 'Koolaid' })).to.eql({ name: 'Koolaid' });
    });

    it('should return an array if passed', function () {
      expect(functionOrValue([1, 2, 5])).to.eql([1, 2, 5]);
    });

    it('should call a function even if no additional arguments are passed', function () {
      expect(functionOrValue(fn)).to.equal(55);
      expect(fn).to.have.been.calledOnce;
    });

    it('should call a function with the additional arguments', function () {
      expect(functionOrValue(fn, 44, {}, 'orange')).to.equal(55);
      expect(fn).to.have.been.calledOnce;
      expect(fn).to.have.been.calledWith(44, {}, 'orange');
    });

    it('should be able to call cascading functions that return other functions', function () {
      const stub = sinon.stub().returns(true);
      fn = () => () => () => stub;
      expect(functionOrValue(fn, 78, [55, 66, 77])).to.be.true;
      expect(stub).to.have.been.calledOnce;
      expect(stub).to.have.been.calledWith(78, [55, 66, 77]);
    });
  });

  describe('tryCatch()', function () {
    let tryFn;
    let catchFn;

    it('should play nice with a sync tryFn', async function () {
      tryFn = sinon.stub().returns({ success: 500 });
      const { response, error } = await tryCatch(tryFn);
      expect(response).to.eql({ success: 500 });
      expect(error).to.be.undefined;
    });

    it('should play nice with an async tryFn', async function () {
      tryFn = sinon.stub().resolves({ success: 500 });
      const { response, error } = await tryCatch(tryFn);
      expect(response).to.eql({ success: 500 });
      expect(error).to.be.undefined;
    });

    it('should provide the error only in the error part of the response if no catchFn is provided', async function () {
      const err = new Error('Bad thing happened.');
      tryFn = sinon.stub().throws(err);
      const { response, error } = await tryCatch(tryFn);
      expect(response).to.be.undefined;
      expect(error).to.eql(err);
    });

    it('should pass the error through the catchFn if provided', async function () {
      let newErr;
      const err = new Error('Bad thing happened.');
      tryFn = sinon.stub().throws(err);
      const { response, error } = await tryCatch(tryFn, (e) => {
        expect(e).to.eql(err);
        newErr = new Error('Koolaid');
        return newErr;
      });
      expect(response).to.be.undefined;
      expect(error).to.eql(newErr);
    });

    it('should play nice with async catchFn', async function () {
      const err = new Error('Bad thing happened.');
      const newErr = new Error('Less bad thing happened.');
      tryFn = sinon.stub().throws(err);
      catchFn = sinon.stub().resolves(newErr);
      const { response, error } = await tryCatch(tryFn, catchFn);
      expect(response).to.be.undefined;
      expect(error).to.eql(newErr);
    });
  });
});
