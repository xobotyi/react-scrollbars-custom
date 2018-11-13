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
        });

        it("scrollTop must return actual value", () => {
            expect(scrollbar.scrollTop).toBe(scrollbar.contentEl.scrollTop);

            scrollbar.contentEl.scrollTop = 100;
            expect(scrollbar.scrollTop).toBe(scrollbar.contentEl.scrollTop);

            scrollbar.contentEl.scrollTop = 250;
            expect(scrollbar.scrollTop).toBe(scrollbar.contentEl.scrollTop);

            scrollbar.contentEl.scrollTop = -100;
            expect(scrollbar.scrollTop).toBe(scrollbar.contentEl.scrollTop);
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
    });
}
