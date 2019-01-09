import {render, unmountComponentAtNode} from "react-dom";
import * as React from "react";
import NativeScrollbar from "../src/NativeScrollbar";

describe("NativeScrollbar", () => {
    let node: HTMLDivElement;
    beforeAll(() => {
        node = document.createElement('div');
        document.body.appendChild(node);
    });
    afterEach(() => {
        unmountComponentAtNode(node);
    });
    afterAll(() => {
        unmountComponentAtNode(node);
        document.body.removeChild(node);
    });

    it('should render block', (done) => {
        render(<NativeScrollbar />, node, function () {
            done();
        });
    });

    it('should pass the element ref to element class property', (done) => {
        render(<NativeScrollbar />, node, function () {
            expect(this.element instanceof HTMLElement).toBeTruthy();
            done();
        });
    });

    it('should pass the element ref to elementRef property', (done) => {
        let element: HTMLElement | null;
        render(<NativeScrollbar elementRef={ref => element = ref} />, node, function () {
            expect(element instanceof HTMLElement).toBeTruthy();
            done();
        });
    });

    it('should apply className', (done) => {
        render(<NativeScrollbar className="MyAwesomeClassName" />, node, function () {
            expect(this.element.classList.contains('MyAwesomeClassName')).toBeTruthy();
            done();
        });
    });

    it('should apply style', (done) => {
        render(<NativeScrollbar style={{width: 100, height: 200}} />, node, function () {
            expect(this.element.style.width).toBe('100px');
            expect(this.element.style.height).toBe('200px');
            done();
        });
    });

    it('should apply tagName', (done) => {
        render(<NativeScrollbar tagName="span" />, node, function () {
            expect(this.element.tagName).toBe("SPAN");
            done();
        });
    });

    it('should apply rtl direction', (done) => {
        render(<NativeScrollbar rtl />, node, function () {
            expect(this.element.style.direction).toBe("rtl");
            done();
        });
    });

    it('should apply noScroll parameter', (done) => {
        render(<NativeScrollbar noScroll />, node, function () {
            expect(this.element.style.overflowX).toBe("hidden");
            expect(this.element.style.overflowY).toBe("hidden");
            done();
        });
    });
    it('should apply noScrollX parameter', (done) => {
        render(<NativeScrollbar noScrollX />, node, function () {
            expect(this.element.style.overflowX).toBe("hidden");
            expect(this.element.style.overflowY).not.toBe("hidden");
            done();
        });
    });
    it('should apply noScrollY parameter', (done) => {
        render(<NativeScrollbar noScrollY />, node, function () {
            expect(this.element.style.overflowX).not.toBe("hidden");
            expect(this.element.style.overflowY).toBe("hidden");
            done();
        });
    });

    it('should apply permanentTracks parameter', (done) => {
        render(<NativeScrollbar permanentTracks />, node, function () {
            expect(this.element.style.overflowX).toBe("scroll");
            expect(this.element.style.overflowY).toBe("scroll");
            done();
        });
    });
    it('should apply permanentTrackX parameter', (done) => {
        render(<NativeScrollbar permanentTrackX />, node, function () {
            expect(this.element.style.overflowX).toBe("scroll");
            expect(this.element.style.overflowY).not.toBe("scroll");
            done();
        });
    });
    it('should apply permanentTrackY parameter', (done) => {
        render(<NativeScrollbar permanentTrackY />, node, function () {
            expect(this.element.style.overflowX).not.toBe("scroll");
            expect(this.element.style.overflowY).toBe("scroll");
            done();
        });
    });

    it('should apply momentum  parameter', (done) => {
        render(<NativeScrollbar momentum />, node, function () {
            expect(this.element.style.WebkitOverflowScrolling).toBe("touch");
            done();
        });
    });
});
