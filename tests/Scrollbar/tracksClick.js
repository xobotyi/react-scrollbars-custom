import expect from "expect";
import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import Scrollbar from "react-scrollbars-custom";
import simulant from "simulant";

export default function performTests() {
    describe("scroll triggers", () => {
        let node;

        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });
        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        describe("when click vertical track", function() {
            it("should scroll to relative position", (done) => {
                render(
                    <Scrollbar style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }} />
                    </Scrollbar>,
                    node,
                    function() {
                        const { content, trackVertical } = this;
                        const {
                            top,
                            height,
                        } = trackVertical.getBoundingClientRect();

                        simulant.fire(trackVertical, "mousedown", {
                            which: 1,
                            target: trackVertical,
                            clientY: top + height / 2,
                        });
                        expect(content.scrollTop).toBe(50);
                        done();
                    },
                );
            });
        });

        describe("when click horizontal track", function() {
            it("should scroll to relative position", (done) => {
                render(
                    <Scrollbar style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }} />
                    </Scrollbar>,
                    node,
                    function() {
                        const { content, trackHorizontal } = this;
                        const {
                            left,
                            width,
                        } = trackHorizontal.getBoundingClientRect();

                        simulant.fire(trackHorizontal, "mousedown", {
                            which: 1,
                            target: trackHorizontal,
                            clientX: left + width / 2,
                        });
                        expect(content.scrollLeft).toBe(50);
                        done();
                    },
                );
            });
        });
    });
}
