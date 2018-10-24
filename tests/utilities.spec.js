import expect from "expect";
import React from "react";
import { isset, getScrollbarWidth } from "./../src/util/utilities";

describe("utilities", () => {
    describe("isset()", () => {
        let obj = { a: 123 };

        it("returns false if parameter is undefined", () => {
            expect(isset(undefined)).toBeFalsy();
            expect(isset(obj.b)).toBeFalsy();
        });
        it("returns false if parameter is null", () => {
            expect(isset(null)).toBeFalsy();
        });
        it("returns true otherwise", () => {
            expect(isset(true)).toBeTruthy();
            expect(isset(obj.a)).toBeTruthy();
            expect(isset(123)).toBeTruthy();
            expect(isset("")).toBeTruthy();
            expect(isset(false)).toBeTruthy();
        });
    });

    describe("getScrollbarWidth()", () => {
        it("for chrome must be equal 17 (Windows) or 15 (UNIX)", () => {
            const sbWidth = getScrollbarWidth();

            expect(sbWidth === 17 || sbWidth === 15).toBeTruthy();
        });

        it("second run must take previously calculated value (just for coverage)", () => {
            const sbWidth = getScrollbarWidth();

            expect(sbWidth === 17 || sbWidth === 15).toBeTruthy();
        });
    });
});
