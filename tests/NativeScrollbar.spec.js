import expect from "expect";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import NativeScrollbar from "../src/NativeScrollbar";

describe("NativeScrollbar", () => {
    let node;
    beforeEach(() => {
        node = document.createElement("div");
        document.body.appendChild(node);
    });
    afterEach(() => {
        unmountComponentAtNode(node);
        document.body.removeChild(node);
    });

    it("should render", done => {
        render(<NativeScrollbar />, node, function() {
            expect(this.element.classList.contains("native")).toBeTruthy();

            done();
        });
    });

    it("should accept custom tag name", done => {
        render(<NativeScrollbar tagName="span" />, node, function() {
            expect(this.element.tagName).toBe("SPAN");
            done();
        });
    });

    it("should apply rtl direction", done => {
        render(<NativeScrollbar rtl />, node, function() {
            expect(this.element.style.direction).toBe("rtl");
            expect(this.element.classList.contains("rtl")).toBeTruthy();
            done();
        });
    });

    it("should apply momentum", done => {
        render(<NativeScrollbar momentum />, node, function() {
            expect(this.element.style.WebkitOverflowScrolling).toBe("touch");
            done();
        });
    });

    it("should have overflow auto in regular situation", done => {
        render(<NativeScrollbar />, node, function() {
            expect(this.element.style.overflow).toBe("auto");
            expect(this.element.style.overflowX).toBe("auto");
            expect(this.element.style.overflowY).toBe("auto");
            done();
        });
    });

    it("should apply noScrollX", done => {
        render(<NativeScrollbar noScrollX />, node, function() {
            expect(this.element.style.overflowX).toBe("hidden");
            expect(this.element.style.overflowY).toBe("auto");
            done();
        });
    });

    it("should apply noScrollY", done => {
        render(<NativeScrollbar noScrollY />, node, function() {
            expect(this.element.style.overflowY).toBe("hidden");
            expect(this.element.style.overflowX).toBe("auto");
            done();
        });
    });

    it("should apply noScroll", done => {
        render(<NativeScrollbar noScroll />, node, function() {
            expect(this.element.style.overflow).toBe("hidden");
            done();
        });
    });

    it("should apply permanentTrackX", done => {
        render(<NativeScrollbar permanentTrackX />, node, function() {
            expect(this.element.style.overflowX).toBe("scroll");
            expect(this.element.style.overflowY).toBe("auto");
            done();
        });
    });

    it("should apply permanentTrackY", done => {
        render(<NativeScrollbar permanentTrackY />, node, function() {
            expect(this.element.style.overflowY).toBe("scroll");
            expect(this.element.style.overflowX).toBe("auto");
            done();
        });
    });

    it("should apply permanentTracks", done => {
        render(<NativeScrollbar permanentTracks />, node, function() {
            expect(this.element.style.overflow).toBe("scroll");
            done();
        });
    });
});
