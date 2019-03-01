import {
  getInnerDimensions,
  getInnerHeight,
  getInnerWidth,
  uuid
} from "../src/util";

describe("util", () => {
  describe("uuid", () => {
    it("should generate valid UUID v4", () => {
      expect(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
          uuid()
        )
      ).toBeTruthy();
    });
  });

  describe("in case box-sizing: border-box", () => {
    let div: HTMLDivElement;

    beforeEach(() => {
      div = document.createElement("div");
      div.style.width = "100.5px";
      div.style.height = "200.5px";
      div.style.padding = "25.125px";
      div.style.boxSizing = "border-box";

      document.body.appendChild(div);
    });

    afterEach(() => {
      document.body.removeChild(div);
    });

    describe("getInnerHeight()", () => {
      it("should return number", () => {
        expect(typeof getInnerHeight(div)).toBe("number");
      });

      it("should return float for values with floating point height", () => {
        expect(getInnerHeight(div) % 1 !== 0).toBeTruthy();
      });

      it("should return proper height", () => {
        expect(getInnerHeight(div)).toBe(150.25);
      });

      it("should return proper height for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        expect(getInnerHeight(div)).toBe(200.25);
      });

      it("should return 0 for blocks with display=none||inline", () => {
        div.style.padding = "";
        div.style.width = "";
        div.style.height = "";

        div.style.display = "none";
        expect(getInnerHeight(div)).toBe(0);

        div.style.display = "inline";
        expect(getInnerHeight(div)).toBe(0);
      });

      it("should return 0 for blocks width 0 size and padding", () => {
        const div = document.createElement("div");
        div.style.width = "0";
        div.style.height = "0";
        div.style.padding = "25.375px";
        div.style.boxSizing = "border-box";

        expect(getInnerHeight(div)).toBe(0);
      });

      it("should return proper height if padding has not been set", () => {
        div.style.padding = "";
        expect(getInnerHeight(div)).toBe(200.5);
      });

      it("should return proper height if padding has been set partially", () => {
        div.style.padding = "";
        div.style.paddingTop = "10.375px";
        expect(getInnerHeight(div)).toBe(190.125);
      });
    });

    describe("getInnerWidth()", () => {
      it("should return number", () => {
        expect(typeof getInnerWidth(div)).toBe("number");
      });

      it("should return float for values with floating point height", () => {
        expect(getInnerWidth(div) % 1 !== 0).toBeTruthy();
      });

      it("should return proper width", () => {
        expect(getInnerWidth(div)).toBe(50.25);
      });

      it("should return proper width for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        expect(getInnerWidth(div)).toBe(100.25);
      });

      it("should return 0 for blocks with display=none||inline", () => {
        div.style.padding = "";
        div.style.width = "";
        div.style.height = "";

        div.style.display = "none";
        expect(getInnerWidth(div)).toBe(0);

        div.style.display = "inline";
        expect(getInnerWidth(div)).toBe(0);
      });

      it("should return 0 for blocks width 0 size and padding", () => {
        const div = document.createElement("div");
        div.style.width = "0";
        div.style.height = "0";
        div.style.padding = "25.375px";
        div.style.boxSizing = "border-box";

        expect(getInnerWidth(div)).toBe(0);
      });

      it("should return proper width if padding has not been set", () => {
        div.style.padding = "";
        expect(getInnerWidth(div)).toBe(100.5);
      });

      it("should return proper width if padding has been set partially", () => {
        div.style.padding = "";
        div.style.paddingLeft = "10.375px";
        expect(getInnerWidth(div)).toBe(90.125);
      });
    });

    describe("getInnerDimensions()", () => {
      it("should return number", () => {
        const sizes = getInnerDimensions(div);
        expect(typeof sizes).toBe("object");
        expect(typeof sizes.width).toBe("number");
        expect(typeof sizes.height).toBe("number");
      });

      it("should return float for values with floating point height", () => {
        const sizes = getInnerDimensions(div);
        expect(sizes.width % 1 !== 0).toBeTruthy();
        expect(sizes.height % 1 !== 0).toBeTruthy();
      });

      it("should return proper sizes", () => {
        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(150.25);
        expect(sizes.width).toBe(50.25);
      });

      it("should return proper sizes for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(200.25);
        expect(sizes.width).toBe(100.25);
      });

      it("should return 0 for blocks with display=none||inline", () => {
        div.style.padding = "";
        div.style.width = "";
        div.style.height = "";

        div.style.display = "none";
        expect(getInnerDimensions(div)).toEqual({ width: 0, height: 0 });

        div.style.display = "inline";
        expect(getInnerDimensions(div)).toEqual({ width: 0, height: 0 });
      });

      it("should return 0 for blocks width 0 size and padding", () => {
        const div = document.createElement("div");
        div.style.width = "0";
        div.style.height = "0";
        div.style.padding = "25.375px";
        div.style.boxSizing = "border-box";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(0);
        expect(sizes.width).toBe(0);
      });

      it("should return proper sizes if padding has not been set", () => {
        div.style.padding = "";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(200.5);
        expect(sizes.width).toBe(100.5);
      });

      it("should return proper width if padding has been set partially", () => {
        div.style.padding = "";
        div.style.paddingLeft = "10.375px";
        div.style.paddingTop = "10.375px";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(190.125);
        expect(sizes.width).toBe(90.125);
      });
    });
  });

  describe("in case box-sizing: content-box", () => {
    let div: HTMLDivElement;

    beforeEach(() => {
      div = document.createElement("div");
      div.style.width = "100.5px";
      div.style.height = "200.5px";
      div.style.padding = "25.125px";
      div.style.boxSizing = "content-box";

      document.body.appendChild(div);
    });

    afterEach(() => {
      document.body.removeChild(div);
    });

    describe("getInnerHeight()", () => {
      it("should return number", () => {
        expect(typeof getInnerHeight(div)).toBe("number");
      });

      it("should return float for values with floating point height", () => {
        expect(getInnerHeight(div) % 1 !== 0).toBeTruthy();
      });

      it("should return proper height", () => {
        expect(getInnerHeight(div)).toBe(200.5);
      });

      it("should return proper height for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        expect(getInnerHeight(div)).toBe(200.25);
      });

      it("should return 0 for blocks with display=none||inline", () => {
        div.style.padding = "";
        div.style.width = "";
        div.style.height = "";
        div.style.boxSizing = "";

        div.style.display = "none";
        expect(getInnerHeight(div)).toBe(0);

        div.style.display = "inline";
        expect(getInnerHeight(div)).toBe(0);
      });

      it("should return  0 for blocks width 0 size and padding", () => {
        const div = document.createElement("div");
        div.style.width = "0";
        div.style.height = "0";
        div.style.padding = "25.375px";

        expect(getInnerHeight(div)).toBe(0);
      });

      it("should return proper height if padding has not been set", () => {
        div.style.padding = "";
        expect(getInnerHeight(div)).toBe(200.5);
      });

      it("should return proper height if padding has been set partially", () => {
        div.style.padding = "";
        div.style.paddingTop = "10.375px";
        expect(getInnerHeight(div)).toBe(200.5);
      });
    });

    describe("getInnerWidth()", () => {
      it("should return number", () => {
        expect(typeof getInnerWidth(div)).toBe("number");
      });

      it("should return float for values with floating point height", () => {
        expect(getInnerWidth(div) % 1 !== 0).toBeTruthy();
      });

      it("should return proper width", () => {
        expect(getInnerWidth(div)).toBe(100.5);
      });

      it("should return proper width for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        expect(getInnerWidth(div)).toBe(100.25);
      });

      it("should return 0 for blocks with display=none||inline", () => {
        div.style.padding = "";
        div.style.width = "";
        div.style.height = "";
        div.style.boxSizing = "";

        div.style.display = "none";
        expect(getInnerWidth(div)).toBe(0);

        div.style.display = "inline";
        expect(getInnerWidth(div)).toBe(0);
      });

      it("should return 0 for blocks width 0 size and padding", () => {
        const div = document.createElement("div");
        div.style.width = "0";
        div.style.height = "0";
        div.style.padding = "25.375px";

        expect(getInnerWidth(div)).toBe(0);
      });

      it("should return proper width if padding has not been set", () => {
        div.style.padding = "";
        expect(getInnerWidth(div)).toBe(100.5);
      });

      it("should return proper width if padding has been set partially", () => {
        div.style.padding = "";
        div.style.paddingLeft = "10.375px";
        expect(getInnerWidth(div)).toBe(100.5);
      });
    });

    describe("getInnerDimensions()", () => {
      it("should return number", () => {
        const sizes = getInnerDimensions(div);
        expect(typeof sizes).toBe("object");
        expect(typeof sizes.width).toBe("number");
        expect(typeof sizes.height).toBe("number");
      });

      it("should return float for values with floating point height", () => {
        const sizes = getInnerDimensions(div);
        expect(sizes.width % 1 !== 0).toBeTruthy();
        expect(sizes.height % 1 !== 0).toBeTruthy();
      });

      it("should return proper sizes", () => {
        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(200.5);
        expect(sizes.width).toBe(100.5);
      });

      it("should return proper sizes for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(200.25);
        expect(sizes.width).toBe(100.25);
      });

      it("should return 0 for blocks with display=none||inline", () => {
        div.style.padding = "";
        div.style.width = "";
        div.style.height = "";
        div.style.boxSizing = "";

        div.style.display = "none";
        expect(getInnerDimensions(div)).toEqual({ width: 0, height: 0 });

        div.style.display = "inline";
        expect(getInnerDimensions(div)).toEqual({ width: 0, height: 0 });
      });

      it("should return 0 for blocks width 0 size and padding", () => {
        const div = document.createElement("div");
        div.style.width = "0";
        div.style.height = "0";
        div.style.padding = "25.375px";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(0);
        expect(sizes.width).toBe(0);
      });

      it("should return proper sizes if padding has not been set", () => {
        div.style.padding = "";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(200.5);
        expect(sizes.width).toBe(100.5);
      });

      it("should return proper width if padding has been set partially", () => {
        div.style.padding = "";
        div.style.paddingLeft = "10.375px";
        div.style.paddingTop = "10.375px";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(200.5);
        expect(sizes.width).toBe(100.5);
      });
    });
  });
});
