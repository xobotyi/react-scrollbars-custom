import { isFunction, isset, getScrollbarWidth } from "../src/util/utilities";

describe('utilities', () => {
    describe('isFunction()', function () {
        it('returns false if given parameter is undefined', () => { expect(isFunction(undefined)).to.be.false; });
        it('returns false if given parameter is number', () => { expect(isFunction(123)).to.be.false; });
        it('returns false if given parameter is string', () => { expect(isFunction('Hello world!')).to.be.false; });
        it('returns false if given parameter is boolean', () => { expect(isFunction(false)).to.be.false; });
        it('returns true if given parameter is function', () => { expect(isFunction(() => {})).to.be.true; });
    });

    describe('isset()', function () {
        let a = 3;

        it('returns false if given parameter is undefined', () => {expect(isset(a.b)).to.be.false;});
        it('returns false if given parameter is null', () => {expect(isset(null)).to.be.false;});
        it('returns true if given parameter is defined', () => {expect(isset(a)).to.be.true;});
        it('returns true if given parameter is boolean', () => {expect(isset(true)).to.be.true;});
        it('returns true if given parameter is number', () => {expect(isset(123)).to.be.true;});
    });

    describe('getScrollbarWidth()', function () {
        it('for chrome must be equal 17 (Windows) or 15 (UNIX)', () => {expect(getScrollbarWidth()).to.be.oneOf([17, 15]);});
        it('second run must take previously calculated value (just for coverage)', () => {expect(getScrollbarWidth()).to.be.oneOf([17, 15]);});
    });
});
