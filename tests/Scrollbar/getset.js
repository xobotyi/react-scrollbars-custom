import expect from "expect";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Scrollbar from "react-scrollbars-custom";

export default function performTests() {
    describe("getters", () => {
        let node, scrollbar, div;
        before(() => {
            node = document.createElement("div");
            document.body.appendChild(node);

            render(
                <Scrollbar
                    noDefaultStyles
                    wrapperProps={{style: {width: 100, height: 100, position: "relative", padding: 0, margin: 0}}}
                    ref={ref => (scrollbar = ref)}>
                    <div style={{width: 200, height: 200, padding: 0, margin: 0}} ref={ref => (div = ref)} />
                </Scrollbar>,
                node
            );
        });
        after(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });
        afterEach(() => {
            div.style.width = "200px";
            div.style.height = "200px";
            scrollbar.contentEl.scrollTop = 0;
            scrollbar.contentEl.scrollLeft = 0;
        });

        it("scrollTop must return actual value", () => {
            expect(scrollbar.scrollTop).toBe(scrollbar.contentEl.scrollTop);

            scrollbar.contentEl.scrollTop = 100;
            expect(scrollbar.scrollTop).toBe(scrollbar.contentEl.scrollTop);

            scrollbar.contentEl.scrollTop = 250;
            expect(scrollbar.scrollTop).toBe(scrollbar.contentEl.scrollTop);

            scrollbar.contentEl.scrollTop = -100;
            expect(scrollbar.scrollTop).toBe(scrollbar.contentEl.scrollTop);

            let contentEl = scrollbar.contentEl;
            scrollbar.contentEl = null;
            expect(scrollbar.scrollTop).toBe(0);
            scrollbar.contentEl = contentEl;
        });

        it("scrollTop must set value", () => {
            scrollbar.scrollTop = 50;
            expect(scrollbar.contentEl.scrollTop).toBe(50);

            scrollbar.scrollTop = 0;
            expect(scrollbar.contentEl.scrollTop).toBe(0);

            scrollbar.scrollTop = 150;
            expect(scrollbar.contentEl.scrollTop).toBe(100);

            scrollbar.scrollTop = 300;
            expect(scrollbar.contentEl.scrollTop).toBe(100);

            scrollbar.scrollTop = -100;
            expect(scrollbar.contentEl.scrollTop).toBe(0);
        });

        it("scrollLeft must return actual value", () => {
            expect(scrollbar.scrollLeft).toBe(scrollbar.contentEl.scrollLeft);

            scrollbar.contentEl.scrollLeft = 100;
            expect(scrollbar.scrollLeft).toBe(scrollbar.contentEl.scrollLeft);

            scrollbar.contentEl.scrollLeft = 250;
            expect(scrollbar.scrollLeft).toBe(scrollbar.contentEl.scrollLeft);

            scrollbar.contentEl.scrollLeft = -100;
            expect(scrollbar.scrollLeft).toBe(scrollbar.contentEl.scrollLeft);

            let contentEl = scrollbar.contentEl;
            scrollbar.contentEl = null;
            expect(scrollbar.scrollLeft).toBe(0);
            scrollbar.contentEl = contentEl;
        });

        it("scrollLeft must set value", () => {
            scrollbar.scrollLeft = 50;
            expect(scrollbar.contentEl.scrollLeft).toBe(50);

            scrollbar.scrollLeft = 0;
            expect(scrollbar.contentEl.scrollLeft).toBe(0);

            scrollbar.scrollLeft = 150;
            expect(scrollbar.contentEl.scrollLeft).toBe(100);

            scrollbar.scrollLeft = 300;
            expect(scrollbar.contentEl.scrollLeft).toBe(100);

            scrollbar.scrollLeft = -100;
            expect(scrollbar.contentEl.scrollLeft).toBe(0);
        });

        it("scrollHeight must return actual value", () => {
            expect(scrollbar.scrollHeight).toBe(scrollbar.contentEl.scrollHeight);

            div.style.height = "50px";
            expect(scrollbar.scrollHeight).toBe(scrollbar.contentEl.scrollHeight);

            div.style.height = "500px";
            expect(scrollbar.scrollHeight).toBe(scrollbar.contentEl.scrollHeight);

            let contentEl = scrollbar.contentEl;
            scrollbar.contentEl = null;
            expect(scrollbar.scrollHeight).toBe(0);
            scrollbar.contentEl = contentEl;
        });

        it("scrollWidth must return actual value", () => {
            expect(scrollbar.scrollWidth).toBe(scrollbar.contentEl.scrollWidth);

            div.style.width = "50px";
            expect(scrollbar.scrollWidth).toBe(scrollbar.contentEl.scrollWidth);

            div.style.width = "500px";
            expect(scrollbar.scrollWidth).toBe(scrollbar.contentEl.scrollWidth);

            let contentEl = scrollbar.contentEl;
            scrollbar.contentEl = null;
            expect(scrollbar.scrollWidth).toBe(0);
            scrollbar.contentEl = contentEl;
        });

        it("clientHeight must return actual value", () => {
            expect(scrollbar.clientHeight).toBe(scrollbar.contentEl.clientHeight);

            scrollbar.wrapperEl.height = "50px";
            expect(scrollbar.clientHeight).toBe(scrollbar.contentEl.clientHeight);

            scrollbar.wrapperEl.height = "500px";
            expect(scrollbar.clientHeight).toBe(scrollbar.contentEl.clientHeight);

            let contentEl = scrollbar.contentEl;
            scrollbar.contentEl = null;
            expect(scrollbar.clientHeight).toBe(0);
            scrollbar.contentEl = contentEl;
        });

        it("clientWidth must return actual value", () => {
            expect(scrollbar.clientWidth).toBe(scrollbar.contentEl.clientWidth);

            scrollbar.wrapperEl.width = "50px";
            expect(scrollbar.clientWidth).toBe(scrollbar.contentEl.clientWidth);

            scrollbar.wrapperEl.width = "500px";
            expect(scrollbar.clientWidth).toBe(scrollbar.contentEl.clientWidth);

            let contentEl = scrollbar.contentEl;
            scrollbar.contentEl = null;
            expect(scrollbar.clientWidth).toBe(0);
            scrollbar.contentEl = contentEl;
        });

        it("scrollToTop should scroll to the very top", () => {
            expect(scrollbar.scrollToTop()).toBe(scrollbar);

            expect(scrollbar.contentEl.scrollTop).toBe(0);
        });

        it("scrollToBottom should scroll to the very bottom", () => {
            expect(scrollbar.scrollToBottom()).toBe(scrollbar);

            expect(scrollbar.contentEl.scrollTop).toBe(
                scrollbar.contentEl.scrollHeight - scrollbar.contentEl.clientHeight
            );
        });

        it("scrollToLeft should scroll to the very left", () => {
            expect(scrollbar.scrollToLeft()).toBe(scrollbar);

            expect(scrollbar.contentEl.scrollLeft).toBe(0);
        });

        it("scrollToRight should scroll to the very right", () => {
            expect(scrollbar.scrollToRight()).toBe(scrollbar);

            expect(scrollbar.contentEl.scrollLeft).toBe(
                scrollbar.contentEl.scrollWidth - scrollbar.contentEl.clientWidth
            );
        });
    });
}
