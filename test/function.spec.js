const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');

const { acceptNoArguments } = require('../');

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
});
