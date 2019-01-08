import getScrollbarWidth, {dbgGetDocument, dbgSetDocument, dbgSetScrollbarWidth} from "./../src/getScrollbarWidth";

describe("getScrollbarWidth", () => {
    beforeEach(() => {
        dbgSetScrollbarWidth(null);
        dbgSetDocument(document);
    });

    describe("dbgGetDocument()", () => {
        it("should return document or null", () => {
            expect(dbgGetDocument()).toBe(document);
        });

        it("should return overrided value", () => {
            dbgSetDocument(null);
            expect(dbgGetDocument()).toBe(null);
        });
    });

    describe("dbgSetDocument()", () => {
        it("should set the document or null", () => {
            dbgSetDocument(null);
            expect(dbgGetDocument()).toBe(null);

            dbgSetDocument(document);
            expect(dbgGetDocument()).toBe(document);
        });

        it("should throw if value not null or document", () => {
            // @ts-ignore
            expect(() => dbgSetDocument(123)).toThrow(
                new TypeError("override value expected to be an instance of HTMLDocument or null, got number")
            );
            // @ts-ignore
            expect(() => dbgSetDocument(false)).toThrow(
                new TypeError("override value expected to be an instance of HTMLDocument or null, got boolean")
            );
        });
    });

    describe("dbgSetScrollbarWidth ()", () => {
        it("should set the value returned by getScrollbarWidth()", () => {
            dbgSetScrollbarWidth(2);
            expect(getScrollbarWidth()).toBe(2);
        });

        it("null value should force getScrollbarWidth() to recalculate sbw", () => {
            dbgSetScrollbarWidth(2);
            expect(getScrollbarWidth()).toBe(2);

            dbgSetScrollbarWidth(null);
            expect([17, 15].includes(getScrollbarWidth())).toBeTruthy();
        });

        it("should throw if value not null or number", () => {
            // @ts-ignore
            expect(() => dbgSetScrollbarWidth(false)).toThrow(
                new TypeError("override value expected to be a number or null, got boolean")
            );
            // @ts-ignore
            expect(() => dbgSetScrollbarWidth(undefined)).toThrow(
                new TypeError("override value expected to be a number or null, got undefined")
            );
        });
    });

    describe("getScrollbarWidth()", () => {
        it("should return number", () => {
            expect(typeof getScrollbarWidth()).toBe("number");
        });

        it("should return proper number", () => {
            expect([17, 15].includes(getScrollbarWidth())).toBeTruthy();
        });

        it("should forced recalculate sbw if true passed as 1st parameter", () => {
            dbgSetScrollbarWidth(2);
            expect(getScrollbarWidth()).toBe(2);
            dbgSetDocument(document);
            expect([17, 15].includes(getScrollbarWidth(true))).toBeTruthy();
        });

        it("should return 0 if document is not presented", () => {
            dbgSetDocument(null);
            expect(getScrollbarWidth()).toBe(0);
        });
    });
});
