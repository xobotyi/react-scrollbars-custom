import expect from "expect";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Scrollbar from "react-scrollbars-custom";
import simulant from "simulant";

export default function performTests() {
    describe("track interaction", () => {
        let node;
        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });
        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        it('track click should cause `jump` to the respective position if `trackClickBehavior="jump"`', done => {
            render(
                <Scrollbar
                    trackClickBehavior="jump"
                    style={{width: 100, height: 100, position: "relative", padding: 0, margin: 0}}
                    wrapperProps={{style: {padding: 0, margin: 0}}}>
                    <div style={{width: 1000, height: 1000, padding: 0, margin: 0}} />
                </Scrollbar>,
                node,
                function() {
                    setTimeout(() => {
                        const {
                            top: topX,
                            height: heightX,
                            left: leftX,
                            width: widthX,
                        } = this.trackXEl.getBoundingClientRect();
                        const {
                            top: topY,
                            height: heightY,
                            left: leftY,
                            width: widthY,
                        } = this.trackYEl.getBoundingClientRect();

                        simulant.fire(this.trackXEl, "click", {
                            which: 1,
                            clientY: topX + heightX / 2,
                            clientX: leftX + widthX / 2,
                        });
                        simulant.fire(this.trackYEl, "click", {
                            which: 1,
                            clientY: topY + heightY / 2,
                            clientX: leftY + widthY / 2,
                        });

                        setTimeout(() => {
                            expect(this.contentEl.scrollTop).toBe(
                                (this.contentEl.scrollHeight - this.contentEl.clientHeight) / 2
                            );
                            expect(this.contentEl.scrollLeft).toBe(
                                (this.contentEl.scrollWidth - this.contentEl.clientWidth) / 2
                            );

                            done();
                        }, 20);
                    }, 20);
                }
            );
        });

        it('track click should cause `step` towards clicked position if `trackClickBehavior="step"`', done => {
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
                            top: topX,
                            height: heightX,
                            left: leftX,
                            width: widthX,
                        } = this.trackXEl.getBoundingClientRect();
                        const {
                            top: topY,
                            height: heightY,
                            left: leftY,
                            width: widthY,
                        } = this.trackYEl.getBoundingClientRect();

                        simulant.fire(this.trackXEl, "click", {
                            which: 1,
                            clientY: topX + heightX / 2,
                            clientX: leftX + widthX / 2,
                        });
                        simulant.fire(this.trackYEl, "click", {
                            which: 1,
                            clientY: topY + heightY / 2,
                            clientX: leftY + widthY / 2,
                        });

                        setTimeout(() => {
                            expect(this.contentEl.scrollTop).toBe(this.contentEl.clientHeight);
                            expect(this.contentEl.scrollLeft).toBe(this.contentEl.clientWidth);

                            simulant.fire(this.trackXEl, "click", {
                                which: 1,
                                clientY: topX + heightX / 2,
                                clientX: leftX + widthX / 2,
                            });
                            simulant.fire(this.trackYEl, "click", {
                                which: 1,
                                clientY: topY + heightY / 2,
                                clientX: leftY + widthY / 2,
                            });

                            setTimeout(() => {
                                expect(this.contentEl.scrollTop).toBe(2 * this.contentEl.clientHeight);
                                expect(this.contentEl.scrollLeft).toBe(2 * this.contentEl.clientWidth);

                                simulant.fire(this.trackXEl, "click", {
                                    which: 1,
                                    clientY: topX,
                                    clientX: leftX,
                                });
                                simulant.fire(this.trackYEl, "click", {
                                    which: 1,
                                    clientY: topY,
                                    clientX: leftY,
                                });

                                setTimeout(() => {
                                    expect(this.contentEl.scrollTop).toBe(this.contentEl.clientHeight);
                                    expect(this.contentEl.scrollLeft).toBe(this.contentEl.clientWidth);

                                    simulant.fire(this.trackXEl, "click", {
                                        which: 1,
                                        clientY: topX,
                                        clientX: leftX,
                                    });
                                    simulant.fire(this.trackYEl, "click", {
                                        which: 1,
                                        clientY: topY,
                                        clientX: leftY,
                                    });

                                    setTimeout(() => {
                                        expect(this.contentEl.scrollTop).toBe(0);
                                        expect(this.contentEl.scrollLeft).toBe(0);

                                        done();
                                    }, 20);
                                }, 20);
                            }, 20);
                        }, 20);
                    }, 20);
                }
            );
        });
    });
}
