import {
  _dbgGetDocument,
  _dbgSetDocument,
  _dbgSetIsReverseRTLScrollNeeded,
  _dbgSetScrollbarWidth,
  calcScrollForThumbOffset,
  calcThumbOffset,
  calcThumbSize,
  getInnerDimensions,
  getInnerHeight,
  getInnerWidth,
  getScrollbarWidth,
  renderDivWithRenderer,
  shouldReverseRTLScroll,
  uuid
} from "../src/util";

describe("util", () => {
  afterAll(() => {
    _dbgSetDocument(null);
    _dbgSetScrollbarWidth(null);
  });

  describe("calcThumbSize", () => {
    it("should return number", () => {
      expect(typeof calcThumbSize(400, 200, 200, 30, 0) === "number").toBeTruthy();
    });

    it("should return 0 if viewport size >= contentSize", () => {
      expect(calcThumbSize(100, 200, 200, 30, 0)).toBe(0);
      expect(calcThumbSize(200, 200, 200, 30, 0)).toBe(0);
    });

    it("should return proper values", () => {
      expect(calcThumbSize(200, 100, 100)).toBe(50);
      expect(calcThumbSize(1000, 100, 100)).toBe(10);
    });

    it("should no exceed minimal value", () => {
      expect(calcThumbSize(1000, 100, 100, 30)).toBe(30);
    });
    it("should no exceed maximal value", () => {
      expect(calcThumbSize(200, 100, 100, undefined, 30)).toBe(30);
    });
  });

  describe("calcThumbOffset", () => {
    it("should return number", () => {
      expect(typeof calcThumbOffset(0, 0, 0, 0, 0) === "number").toBeTruthy();
    });

    it("should return 0 if viewport size >= contentSize", () => {
      expect(calcThumbOffset(100, 200, 200, 200, 50)).toBe(0);
      expect(calcThumbOffset(200, 200, 200, 100, 50)).toBe(0);
    });

    it("should return 0 if thumb size === 0", () => {
      expect(calcThumbOffset(100, 200, 200, 0, 50)).toBe(0);
    });

    it("should return 0 if scroll === 0", () => {
      expect(calcThumbOffset(100, 200, 200, 0, 0)).toBe(0);
    });

    it("should return proper values", () => {
      expect(calcThumbOffset(1000, 500, 500, 250, 100)).toBe(50);
      expect(calcThumbOffset(200, 100, 100, 50, 100)).toBe(50);
    });
  });

  describe("calcScrollForThumbOffset", () => {
    it("should return number", () => {
      expect(typeof calcScrollForThumbOffset(0, 0, 0, 0, 0) === "number").toBeTruthy();
    });

    it("should return 0 if viewport size >= contentSize", () => {
      expect(calcScrollForThumbOffset(100, 200, 200, 200, 50)).toBe(0);
      expect(calcScrollForThumbOffset(200, 200, 200, 100, 50)).toBe(0);
    });

    it("should return 0 if thumb size === 0", () => {
      expect(calcScrollForThumbOffset(100, 200, 200, 0, 50)).toBe(0);
    });

    it("should return 0 if thumb offset === 0", () => {
      expect(calcScrollForThumbOffset(100, 200, 200, 0, 50)).toBe(0);
    });

    it("should return proper values", () => {
      expect(calcScrollForThumbOffset(1000, 500, 500, 250, 50)).toBe(100);
      expect(calcScrollForThumbOffset(200, 100, 100, 50, 50)).toBe(100);
    });
  });

  describe("uuid", () => {
    it("should generate valid UUID v4", () => {
      expect(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(uuid())).toBeTruthy();
    });

    it("should generate unique UUID", () => {
      for (let i: number = 0; i < 50; i++) {
        expect(uuid()).not.toBe(uuid());
      }
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

      it("should return 0 for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        expect(getInnerHeight(div)).toBe(0);
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

      it("should return 0 for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        expect(getInnerWidth(div)).toBe(0);
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

      it("should return 0 for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(0);
        expect(sizes.width).toBe(0);
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

      it("should return 0 for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        expect(getInnerHeight(div)).toBe(0);
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

      it("should return 0 for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        expect(getInnerWidth(div)).toBe(0);
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

      it("should return 0 for unattached element", () => {
        const div = document.createElement("div");
        div.style.width = "100.25px";
        div.style.height = "200.25px";

        const sizes = getInnerDimensions(div);

        expect(sizes.height).toBe(0);
        expect(sizes.width).toBe(0);
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

  describe("getScrollbarWidth", () => {
    beforeEach(() => {
      _dbgSetScrollbarWidth(null);
      _dbgSetDocument(document);
    });

    describe("_dbgGetDocument()", () => {
      it("should return document or null", () => {
        expect(_dbgGetDocument()).toBe(document);
      });

      it("should return overrided value", () => {
        _dbgSetDocument(null);
        expect(_dbgGetDocument()).toBe(null);
      });
    });

    describe("_dbgSetDocument()", () => {
      it("should set the document or null", () => {
        _dbgSetDocument(null);
        expect(_dbgGetDocument()).toBe(null);

        _dbgSetDocument(document);
        expect(_dbgGetDocument()).toBe(document);
      });

      it("should throw if value not null or document", () => {
        // @ts-ignore
        expect(() => _dbgSetDocument(123)).toThrow(
          new TypeError("override value expected to be an instance of HTMLDocument or null, got number")
        );
        // @ts-ignore
        expect(() => _dbgSetDocument(false)).toThrow(
          new TypeError("override value expected to be an instance of HTMLDocument or null, got boolean")
        );
      });
    });

    describe("_dbgSetScrollbarWidth ()", () => {
      it("should set the value returned by getScrollbarWidth()", () => {
        _dbgSetScrollbarWidth(2);
        expect(getScrollbarWidth()).toBe(2);
      });

      it("null value should force getScrollbarWidth() to recalculate sbw", () => {
        _dbgSetScrollbarWidth(2);
        expect(getScrollbarWidth()).toBe(2);

        _dbgSetScrollbarWidth(null);
        expect([17, 15].includes(getScrollbarWidth())).toBeTruthy();
      });

      it("should throw if value not null or number", () => {
        // @ts-ignore
        expect(() => _dbgSetScrollbarWidth(false)).toThrow(
          new TypeError("override value expected to be a number or null, got boolean")
        );
        // @ts-ignore
        expect(() => _dbgSetScrollbarWidth(undefined)).toThrow(
          new TypeError("override value expected to be a number or null, got undefined")
        );
      });
    });

    describe("renderDivWithRenderer()", () => {
      it("does not add elementRef prop", () => {
        let result = renderDivWithRenderer({ elementRef: null, tabIndex: -1 }, null);
        expect(result.props.elementRef).toBeUndefined();
        expect(result.props.tabIndex).toBeDefined();
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
        _dbgSetScrollbarWidth(2);
        expect(getScrollbarWidth()).toBe(2);
        _dbgSetDocument(document);
        expect([17, 15].includes(getScrollbarWidth(true))).toBeTruthy();
      });

      it("should return 0 if document is not presented", () => {
        _dbgSetDocument(null);
        expect(getScrollbarWidth()).toBe(0);
      });
    });
  });

  describe("shouldReverseRTLScroll", () => {
    beforeEach(() => {
      _dbgSetScrollbarWidth(null);
      _dbgSetDocument(document);
    });

    describe("_dbgSetIsReverseRTLScrollNeeded()", () => {
      it("should set the value returned by getScrollbarWidth()", () => {
        _dbgSetIsReverseRTLScrollNeeded(false);
        expect(shouldReverseRTLScroll()).toBeFalsy();
        // @ts-ignore
        _dbgSetIsReverseRTLScrollNeeded(undefined);
        expect(shouldReverseRTLScroll()).toBeFalsy();

        _dbgSetIsReverseRTLScrollNeeded(true);
        expect(shouldReverseRTLScroll()).toBeTruthy();
        // @ts-ignore
        _dbgSetIsReverseRTLScrollNeeded(321);
        expect(shouldReverseRTLScroll()).toBeTruthy();
      });

      it("null should force getScrollbarWidth() to recalculate val", () => {
        _dbgSetIsReverseRTLScrollNeeded(null);
        expect(typeof shouldReverseRTLScroll()).toBe("boolean");
      });
    });

    describe("shouldReverseRTLScroll()", () => {
      it("should return boolean", () => {
        expect(typeof shouldReverseRTLScroll()).toBe("boolean");
      });

      it("should forced recalculate sbw if true passed as 1st parameter", () => {
        _dbgSetIsReverseRTLScrollNeeded(false);
        expect(shouldReverseRTLScroll()).toBeFalsy();

        expect(typeof shouldReverseRTLScroll()).toBe("boolean");
      });

      it("should return false if document is not presented", () => {
        _dbgSetIsReverseRTLScrollNeeded(null);
        _dbgSetDocument(null);
        expect(shouldReverseRTLScroll()).toBeFalsy();
      });
    });
  });
});
