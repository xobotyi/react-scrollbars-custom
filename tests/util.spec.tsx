/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ElementPropsWithElementRef } from '../src/types';
import {
  _dbgGetDocument,
  _dbgSetDocument,
  calcScrollForThumbOffset,
  calcThumbOffset,
  calcThumbSize,
  getInnerHeight,
  getInnerWidth,
  getScrollbarWidth,
  renderDivWithRenderer,
  shouldReverseRtlScroll,
  uuid,
} from '../src/util';

describe('util', () => {
  afterAll(() => {
    delete shouldReverseRtlScroll._cache;
    delete getScrollbarWidth._cache;
  });

  describe('calcThumbSize', () => {
    it('should return number', () => {
      expect(typeof calcThumbSize(400, 200, 200, 30, 0)).toBe('number');
    });

    it('should return 0 if viewport size >= contentSize', () => {
      expect(calcThumbSize(100, 200, 200, 30, 0)).toBe(0);
      expect(calcThumbSize(200, 200, 200, 30, 0)).toBe(0);
    });

    it('should return proper values', () => {
      expect(calcThumbSize(200, 100, 100)).toBe(50);
      expect(calcThumbSize(1000, 100, 100)).toBe(10);
    });

    it('should no exceed minimal value', () => {
      expect(calcThumbSize(1000, 100, 100, 30)).toBe(30);
    });
    it('should no exceed maximal value', () => {
      expect(calcThumbSize(200, 100, 100, undefined, 30)).toBe(30);
    });
  });

  describe('calcThumbOffset', () => {
    it('should return number', () => {
      expect(typeof calcThumbOffset(0, 0, 0, 0, 0)).toBe('number');
    });

    it('should return 0 if viewport size >= contentSize', () => {
      expect(calcThumbOffset(100, 200, 200, 200, 50)).toBe(0);
      expect(calcThumbOffset(200, 200, 200, 100, 50)).toBe(0);
    });

    it('should return 0 if thumb size === 0', () => {
      expect(calcThumbOffset(100, 200, 200, 0, 50)).toBe(0);
    });

    it('should return 0 if scroll === 0', () => {
      expect(calcThumbOffset(100, 200, 200, 0, 0)).toBe(0);
    });

    it('should return proper values', () => {
      expect(calcThumbOffset(1000, 500, 500, 250, 100)).toBe(50);
      expect(calcThumbOffset(200, 100, 100, 50, 100)).toBe(50);
    });
  });

  describe('calcScrollForThumbOffset', () => {
    it('should return number', () => {
      expect(typeof calcScrollForThumbOffset(0, 0, 0, 0, 0)).toBe('number');
    });

    it('should return 0 if viewport size >= contentSize', () => {
      expect(calcScrollForThumbOffset(100, 200, 200, 200, 50)).toBe(0);
      expect(calcScrollForThumbOffset(200, 200, 200, 100, 50)).toBe(0);
    });

    it('should return 0 if thumb size === 0', () => {
      expect(calcScrollForThumbOffset(100, 200, 200, 0, 50)).toBe(0);
    });

    it('should return 0 if thumb offset === 0', () => {
      expect(calcScrollForThumbOffset(100, 200, 200, 0, 50)).toBe(0);
    });

    it('should return proper values', () => {
      expect(calcScrollForThumbOffset(1000, 500, 500, 250, 50)).toBe(100);
      expect(calcScrollForThumbOffset(200, 100, 100, 50, 50)).toBe(100);
    });
  });

  describe('uuid', () => {
    it('should generate valid UUID v4', () => {
      expect(/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[\da-f]{4}-[\da-f]{12}$/.test(uuid())).toBe(true);
    });

    it('should generate unique UUID', () => {
      for (let i = 0; i < 50; i++) {
        expect(uuid()).not.toBe(uuid());
      }
    });
  });

  describe('in case box-sizing: border-box', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
      div = document.createElement('div');
      div.style.width = '100.5px';
      div.style.height = '200.5px';
      div.style.padding = '25.125px';
      div.style.boxSizing = 'border-box';

      document.body.append(div);
    });

    afterEach(() => {
      div.remove();
    });

    describe('getInnerHeight()', () => {
      it('should return number', () => {
        expect(typeof getInnerHeight(div)).toBe('number');
      });

      it('should return float for values with floating point height', () => {
        expect(getInnerHeight(div) % 1 !== 0).toBe(true);
      });

      it('should return proper height', () => {
        expect(getInnerHeight(div)).toBe(150.25);
      });

      it('should return 0 for unattached element', () => {
        const div = document.createElement('div');
        div.style.width = '100.25px';
        div.style.height = '200.25px';

        expect(getInnerHeight(div)).toBe(0);
      });

      it('should return 0 for blocks with display=none||inline', () => {
        div.style.padding = '';
        div.style.width = '';
        div.style.height = '';

        div.style.display = 'none';
        expect(getInnerHeight(div)).toBe(0);

        div.style.display = 'inline';
        expect(getInnerHeight(div)).toBe(0);
      });

      it('should return 0 for blocks width 0 size and padding', () => {
        const div = document.createElement('div');
        div.style.width = '0';
        div.style.height = '0';
        div.style.padding = '25.375px';
        div.style.boxSizing = 'border-box';

        expect(getInnerHeight(div)).toBe(0);
      });

      it('should return proper height if padding has not been set', () => {
        div.style.padding = '';
        expect(getInnerHeight(div)).toBe(200.5);
      });

      it('should return proper height if padding has been set partially', () => {
        div.style.padding = '';
        div.style.paddingTop = '10.375px';
        expect(getInnerHeight(div)).toBe(190.125);
      });
    });

    describe('getInnerWidth()', () => {
      it('should return number', () => {
        expect(typeof getInnerWidth(div)).toBe('number');
      });

      it('should return float for values with floating point height', () => {
        expect(getInnerWidth(div) % 1 !== 0).toBe(true);
      });

      it('should return proper width', () => {
        expect(getInnerWidth(div)).toBe(50.25);
      });

      it('should return 0 for unattached element', () => {
        const div = document.createElement('div');
        div.style.width = '100.25px';
        div.style.height = '200.25px';

        expect(getInnerWidth(div)).toBe(0);
      });

      it('should return 0 for blocks with display=none||inline', () => {
        div.style.padding = '';
        div.style.width = '';
        div.style.height = '';

        div.style.display = 'none';
        expect(getInnerWidth(div)).toBe(0);

        div.style.display = 'inline';
        expect(getInnerWidth(div)).toBe(0);
      });

      it('should return 0 for blocks width 0 size and padding', () => {
        const div = document.createElement('div');
        div.style.width = '0';
        div.style.height = '0';
        div.style.padding = '25.375px';
        div.style.boxSizing = 'border-box';

        expect(getInnerWidth(div)).toBe(0);
      });

      it('should return proper width if padding has not been set', () => {
        div.style.padding = '';
        expect(getInnerWidth(div)).toBe(100.5);
      });

      it('should return proper width if padding has been set partially', () => {
        div.style.padding = '';
        div.style.paddingLeft = '10.375px';
        expect(getInnerWidth(div)).toBe(90.125);
      });
    });
  });

  describe('in case box-sizing: content-box', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
      div = document.createElement('div');
      div.style.width = '100.5px';
      div.style.height = '200.5px';
      div.style.padding = '25.125px';
      div.style.boxSizing = 'content-box';

      document.body.append(div);
    });

    afterEach(() => {
      div.remove();
    });

    describe('getInnerHeight()', () => {
      it('should return number', () => {
        expect(typeof getInnerHeight(div)).toBe('number');
      });

      it('should return float for values with floating point height', () => {
        expect(getInnerHeight(div) % 1 !== 0).toBe(true);
      });

      it('should return proper height', () => {
        expect(getInnerHeight(div)).toBe(200.5);
      });

      it('should return 0 for unattached element', () => {
        const div = document.createElement('div');
        div.style.width = '100.25px';
        div.style.height = '200.25px';

        expect(getInnerHeight(div)).toBe(0);
      });

      it('should return 0 for blocks with display=none||inline', () => {
        div.style.padding = '';
        div.style.width = '';
        div.style.height = '';
        div.style.boxSizing = '';

        div.style.display = 'none';
        expect(getInnerHeight(div)).toBe(0);

        div.style.display = 'inline';
        expect(getInnerHeight(div)).toBe(0);
      });

      it('should return  0 for blocks width 0 size and padding', () => {
        const div = document.createElement('div');
        div.style.width = '0';
        div.style.height = '0';
        div.style.padding = '25.375px';

        expect(getInnerHeight(div)).toBe(0);
      });

      it('should return proper height if padding has not been set', () => {
        div.style.padding = '';
        expect(getInnerHeight(div)).toBe(200.5);
      });

      it('should return proper height if padding has been set partially', () => {
        div.style.padding = '';
        div.style.paddingTop = '10.375px';
        expect(getInnerHeight(div)).toBe(200.5);
      });
    });

    describe('getInnerWidth()', () => {
      it('should return number', () => {
        expect(typeof getInnerWidth(div)).toBe('number');
      });

      it('should return float for values with floating point height', () => {
        expect(getInnerWidth(div) % 1 !== 0).toBe(true);
      });

      it('should return proper width', () => {
        expect(getInnerWidth(div)).toBe(100.5);
      });

      it('should return 0 for unattached element', () => {
        const div = document.createElement('div');
        div.style.width = '100.25px';
        div.style.height = '200.25px';

        expect(getInnerWidth(div)).toBe(0);
      });

      it('should return 0 for blocks with display=none||inline', () => {
        div.style.padding = '';
        div.style.width = '';
        div.style.height = '';
        div.style.boxSizing = '';

        div.style.display = 'none';
        expect(getInnerWidth(div)).toBe(0);

        div.style.display = 'inline';
        expect(getInnerWidth(div)).toBe(0);
      });

      it('should return 0 for blocks width 0 size and padding', () => {
        const div = document.createElement('div');
        div.style.width = '0';
        div.style.height = '0';
        div.style.padding = '25.375px';

        expect(getInnerWidth(div)).toBe(0);
      });

      it('should return proper width if padding has not been set', () => {
        div.style.padding = '';
        expect(getInnerWidth(div)).toBe(100.5);
      });

      it('should return proper width if padding has been set partially', () => {
        div.style.padding = '';
        div.style.paddingLeft = '10.375px';
        expect(getInnerWidth(div)).toBe(100.5);
      });
    });
  });

  describe('_dbgGetDocument()', () => {
    it('should return document or null', () => {
      expect(_dbgGetDocument()).toBe(document);
    });

    it('should return overrided value', () => {
      _dbgSetDocument(null);
      expect(_dbgGetDocument()).toBe(null);
    });
  });

  describe('_dbgSetDocument()', () => {
    it('should set the document or null', () => {
      _dbgSetDocument(null);
      expect(_dbgGetDocument()).toBe(null);

      _dbgSetDocument(document);
      expect(_dbgGetDocument()).toBe(document);
    });

    it('should throw if value not null or document', () => {
      // @ts-expect-error testing purposes
      expect(() => _dbgSetDocument(123)).toThrow(
        new TypeError(
          'override value expected to be an instance of HTMLDocument or null, got number'
        )
      );
      // @ts-expect-error testing purposes
      expect(() => _dbgSetDocument(false)).toThrow(
        new TypeError(
          'override value expected to be an instance of HTMLDocument or null, got boolean'
        )
      );
    });
  });

  describe('renderDivWithRenderer()', () => {
    let node: HTMLDivElement;
    beforeAll(() => {
      node = document.createElement('div');
      document.body.append(node);
    });
    afterEach(() => {
      ReactDOM.unmountComponentAtNode(node);
    });
    afterAll(() => {
      ReactDOM.unmountComponentAtNode(node);
      node.remove();
    });

    it('should not leak `elementRef` if renderer not presented', () => {
      const res = renderDivWithRenderer({ elementRef: undefined, className: 'tests' }, () => {});
      expect(res!.props.hasOwnProperty('elementRef')).toBe(false);
      expect(res!.props.className).toBe('tests');
    });

    it('should pass elementRef as ref if renderer not presented', (done) => {
      const ref = jasmine.createSpy();
      ReactDOM.render(
        renderDivWithRenderer({ elementRef: undefined, className: 'tests' }, ref),
        node,
        () => {
          expect(ref).toHaveBeenCalled();
          done();
        }
      );
    });

    it("should not leak renderer prop if it's passed", () => {
      const renderer = jasmine.createSpy();
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const ref = () => {};
      renderDivWithRenderer({ className: 'tests', renderer }, ref);

      expect(renderer).toHaveBeenCalled();
      const res = renderer.calls.argsFor(0) as ElementPropsWithElementRef;
      expect(res[0].hasOwnProperty('ref')).toBe(false);
      expect(res[0].hasOwnProperty('renderer')).toBe(false);
      expect(res[0].elementRef).toBe(ref);
      expect(res[0].className).toBe('tests');
    });
  });

  describe('getScrollbarWidth', () => {
    beforeEach(() => {
      delete getScrollbarWidth._cache;
      _dbgSetDocument(document);
    });

    it('should return number', () => {
      expect(typeof getScrollbarWidth()).toBe('number');
    });

    it('should return proper number', () => {
      expect([17, 15].includes(getScrollbarWidth()!)).toBe(true);
    });

    it('should forced recalculate sbw if true passed as 1st parameter', () => {
      getScrollbarWidth._cache = 2;
      expect(getScrollbarWidth()).toBe(2);
      _dbgSetDocument(document);
      expect([17, 15].includes(getScrollbarWidth(true)!)).toBe(true);
    });

    it('should return 0 if document is not presented', () => {
      _dbgSetDocument(null);
      expect(getScrollbarWidth()).toBe(0);
    });
  });

  describe('shouldReverseRTLScroll', () => {
    beforeEach(() => {
      _dbgSetDocument(document);
      delete shouldReverseRtlScroll._cache;
    });

    it('should return boolean', () => {
      expect(typeof shouldReverseRtlScroll()).toBe('boolean');
    });

    // it("should return proper value", () => {
    //   expect(shouldReverseRtlScroll()).toBe(true);
    // });

    // it("should forced perform check if true passed as 1st parameter", () => {
    //   shouldReverseRtlScroll._cache = true;
    //   expect(shouldReverseRtlScroll()).toBe(true);
    //   expect(shouldReverseRtlScroll(true)).toBe(true);
    // });

    it('should return false if document is not presented', () => {
      _dbgSetDocument(null);
      expect(shouldReverseRtlScroll()).toBe(false);
    });
  });
});
