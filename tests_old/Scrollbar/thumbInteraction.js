import expect from "expect";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Scrollbar from "react-scrollbars-custom";
import simulant from "simulant";

export default function performTests() {
    describe("thumb interaction", () => {
        let node;
        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });
        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        it("thumb drag should scroll to respective position", done => {
            render(
                <Scrollbar
                    trackClickBehavior="step"
                    style={{width: 100, height: 100, position: "relative", padding: 0, margin: 0}}
                    wrapperProps={{style: {padding: 0, margin: 0}}}>
                    <div style={{width: 1000, height: 1000, padding: 0, margin: 0}} />
                </Scrollbar>,
                node,
                function() {
                    setTimeout(() => {
                        const {
                            top: trackXTop,
                            height: trackXHeight,
                            left: trackXLeft,
                            width: trackXWidth,
                        } = this.trackXEl.getBoundingClientRect();
                        const {
                            top: trackYTop,
                            height: trackYHeight,
                            left: trackYLeft,
                            width: trackYWidth,
                        } = this.trackYEl.getBoundingClientRect();
                        const {
                            top: thumbXTop,
                            height: thumbXHeight,
                            left: thumbXLeft,
                            width: thumbXWidth,
                        } = this.thumbXEl.getBoundingClientRect();
                        const {
                            top: thumbYTop,
                            height: thumbYHeight,
                            left: thumbYLeft,
                            width: thumbYWidth,
                        } = this.thumbYEl.getBoundingClientRect();

                        simulant.fire(this.thumbYEl, "mousedown", {
                            which: 1,
                            clientY: thumbYTop + thumbYHeight / 2,
                            clientX: thumbYLeft + thumbYWidth / 2,
                        });
                        simulant.fire(document, "mousemove", {
                            which: 1,
                            clientY: trackYTop + trackYHeight / 2,
                            clientX: trackYLeft + trackYWidth / 2,
                        });
                        simulant.fire(document, "mouseup", {
                            which: 1,
                            clientY: trackYTop + trackYHeight / 2,
                            clientX: trackYLeft + trackYWidth / 2,
                        });

                        setTimeout(() => {
                            expect(this.contentEl.scrollTop).toBe(
                                this.contentEl.scrollHeight / 2 - this.contentEl.clientHeight / 2
                            );

                            simulant.fire(this.thumbXEl, "mousedown", {
                                which: 1,
                                clientY: thumbXTop + thumbXHeight / 2,
                                clientX: thumbXLeft + thumbXWidth / 2,
                            });
                            simulant.fire(document, "mousemove", {
                                which: 1,
                                clientY: trackXTop + trackXHeight / 2,
                                clientX: trackXLeft + trackXWidth / 2,
                            });
                            simulant.fire(document, "mouseup", {
                                which: 1,
                                clientY: trackXTop + trackXHeight / 2,
                                clientX: trackXLeft + trackXWidth / 2,
                            });

                            setTimeout(() => {
                                expect(this.contentEl.scrollLeft).toBe(
                                    this.contentEl.scrollWidth / 2 - this.contentEl.clientWidth / 2
                                );

                                done();
                            }, 20);
                        }, 20);
                    }, 20);
                }
            );
        });
    });
}
