import expect from "expect";
import React from "react";
import getScrollbarWidth, {dbgGetDocument, dbgSetDocument, dbgSetScrollbarWidth} from "../src/util/getScrollbarWidth";

describe("getScrollbarWidth()", () => {
    it("for chrome must be equal 17 (Windows) or 15 (UNIX)", () => {
        const sbWidth = getScrollbarWidth();

        expect(sbWidth === 17 || sbWidth === 15).toBeTruthy();
    });

    it("second run must take previously calculated value (just for coverage)", () => {
        const sbWidth = getScrollbarWidth();

        expect(sbWidth === 17 || sbWidth === 15).toBeTruthy();
    });

    it("dbgSetScrollbarWidth() should set the width", () => {
        dbgSetScrollbarWidth(0);
        expect(getScrollbarWidth()).toEqual(0);
    });

    it("force call after dbgSetScrollbarWidth() should return actual width", () => {
        const sbWidth = getScrollbarWidth(true);
        expect(sbWidth === 17 || sbWidth === 15).toBeTruthy();
    });

    it("dbgSetDocument() should set the dunction's document reference", () => {
        dbgSetDocument(null);
        expect(dbgGetDocument()).toBeNull();
    });

    it("should return 0 if document variable is not defined", () => {
        dbgSetDocument(null);
        expect(getScrollbarWidth(true)).toEqual(0);
        dbgSetDocument(document);
    });
});
