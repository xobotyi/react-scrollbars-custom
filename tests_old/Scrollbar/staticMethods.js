import expect from "expect";
import Scrollbar from "react-scrollbars-custom";

export default function performTests() {
    describe("static methods", () => {
        describe("`computeThumbSize`", () => {
            it("should properly calculate values", () => {
                expect(Scrollbar.computeThumbSize(100, 200, 100, 0)).toBe(50);
                expect(Scrollbar.computeThumbSize(50, 100, 50, 70)).toBe(70);
                expect(Scrollbar.computeThumbSize(100.25, 224.3, 104.7, 30)).toBe(47);
                expect(Scrollbar.computeThumbSize(100, 100, 100, 30)).toBe(0);
                expect(Scrollbar.computeThumbSize(0, 0, 0, 0)).toBe(0);
            });
        });

        describe("`computeThumbOffset`", () => {
            it("should properly calculate values", () => {
                expect(Scrollbar.computeThumbOffset(100, 50, 200, 100, 50)).toBe(25);
                expect(Scrollbar.computeThumbOffset(100, 50, 200, 100, 0)).toBe(0);
                expect(Scrollbar.computeThumbOffset(0, 0, 0, 0, 0)).toBe(0);
            });
        });

        describe("`computeScrollForOffset`", () => {
            it("should properly calculate values", () => {
                expect(Scrollbar.computeScrollForOffset(100, 50, 50, 200, 100)).toBe(50);
                expect(Scrollbar.computeScrollForOffset(0, 0, 0, 0, 0)).toBe(0);
            });
        });
    });
}
