import {getInnerHeight, getInnerWidth, util} from "../src/util";

describe("getInnerSizes", () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement("div");
        div.style.width = "100px";
        div.style.height = "200px";

        document.body.appendChild(div);
    });
    afterEach(() => {
        document.body.removeChild(div);
    });

    describe("getInnerHeight()", () => {
        it("should return number", () => {
            expect(typeof getInnerHeight(div)).toBe("number");
        });

        it("should return 0 for unattached element", () => {
            const div = document.createElement("div");
            div.style.width = "100px";
            div.style.height = "200px";

            expect(getInnerHeight(div)).toBe(0);
        });

        it("should return proper height if paddings has not been set", () => {
            expect(getInnerHeight(div)).toBe(div.clientHeight);
        });

        it("should return proper height if paddings HAS been set", () => {
            div.style.paddingTop = "10px";
            div.style.paddingBottom = "10px";
            expect(getInnerHeight(div)).toBe(div.clientHeight - 20);
        });

        it("should return proper height if paddings HAS been set partially", () => {
            div.style.paddingTop = "10px";
            expect(getInnerHeight(div)).toBe(div.clientHeight - 10);
        });
    });

    describe("getInnerWidth()", () => {
        it("should return number", () => {
            expect(typeof getInnerWidth(div)).toBe("number");
        });

        it("should return 0 for unattached element", () => {
            const div = document.createElement("div");
            div.style.width = "100px";
            div.style.height = "200px";

            expect(getInnerWidth(div)).toBe(0);
        });

        it("should return proper width if paddings has not been set", () => {
            expect(getInnerWidth(div)).toBe(div.clientWidth);
        });

        it("should return proper width if paddings HAS been set", () => {
            div.style.paddingTop = "10px";
            div.style.paddingBottom = "10px";
            div.style.paddingLeft = "10px";
            div.style.paddingRight = "10px";

            expect(getInnerWidth(div)).toBe(div.clientWidth - 20);
        });

        it("should return proper width if paddings HAS been set partially", () => {
            div.style.paddingLeft = "10px";

            expect(getInnerWidth(div)).toBe(div.clientWidth - 10);
        });
    });

    describe("getInnerSizes()", () => {
        it("should return number", () => {
            const sizes = util(div);

            expect(typeof sizes).toBe("object");
            expect(typeof sizes.height).toBe("number");
            expect(typeof sizes.width).toBe("number");
        });

        it("should return 0 for unattached element", () => {
            const div = document.createElement("div");
            div.style.width = "100px";
            div.style.height = "200px";

            const sizes = util(div);

            expect(sizes.height).toBe(0);
            expect(sizes.width).toBe(0);
        });

        it("should return proper sizes if paddings has not been set", () => {
            const sizes = util(div);

            expect(sizes.height).toBe(div.clientHeight);
            expect(sizes.width).toBe(div.clientWidth);
        });

        it("should return proper height if paddings HAS been set", () => {
            div.style.paddingTop = "10px";
            div.style.paddingBottom = "10px";
            div.style.paddingLeft = "10px";
            div.style.paddingRight = "10px";

            const sizes = util(div);

            expect(sizes.height).toBe(div.clientHeight - 20);
            expect(sizes.width).toBe(div.clientWidth - 20);
        });

        it("should return proper height if paddings HAS been set partially", () => {
            div.style.paddingTop = "10px";
            div.style.paddingLeft = "10px";

            const sizes = util(div);

            expect(sizes.height).toBe(div.clientHeight - 10);
            expect(sizes.width).toBe(div.clientWidth - 10);
        });
    });
});
