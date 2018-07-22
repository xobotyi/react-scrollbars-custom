import expect                                   from "expect";
import { getScrollbarWidth, isFunction, isset } from "../src/util/utilities";

describe("utilities", () => {
    describe("isFunction()", function () {
        it("returns false if given parameter is undefined", () => { expect(isFunction(undefined)).toBeFalsy(); });
        it("returns false if given parameter is number", () => { expect(isFunction(123)).toBeFalsy(); });
        it("returns false if given parameter is string", () => { expect(isFunction("Hello world!")).toBeFalsy(); });
        it("returns false if given parameter is boolean", () => { expect(isFunction(false)).toBeFalsy(); });
        it("returns true if given parameter is function", () => { expect(isFunction(() => {})).toBeTruthy(); });
    });

    describe("isset()", function () {
        let a = 3;

        it("returns false if given parameter is undefined", () => {expect(isset(a.b)).toBeFalsy();});
        it("returns false if given parameter is null", () => {expect(isset(null)).toBeFalsy();});
        it("returns true if given parameter is defined", () => {expect(isset(a)).toBeTruthy();});
        it("returns true if given parameter is boolean", () => {expect(isset(true)).toBeTruthy();});
        it("returns true if given parameter is number", () => {expect(isset(123)).toBeTruthy();});
    });

    describe("getScrollbarWidth()", function () {
        it("for chrome must be equal 17 (Windows) or 15 (UNIX)",
           () => {
               const sbWidth = getScrollbarWidth();

               expect(sbWidth === 17 || sbWidth === 15).toBeTruthy();
           });
        it("second run must take previously calculated value (just for coverage)",
           () => {
               const sbWidth = getScrollbarWidth();

               expect(sbWidth === 17 || sbWidth === 15).toBeTruthy();
           });
    });
});
