import expect                             from "expect";
import React                              from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Scrollbar }                      from "react-scrollbars-custom";
import simulant                           from "simulant";

export default function createTests(scrollbarWidth) {
    describe("dragging", () => {
        let node;

        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });
        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        describe("when dragging vertical thumb", function () {
            it("should scroll to respective position", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                const {content, thumbVertical: thumb} = this;
                                const {top: thumbOffset} = thumb.getBoundingClientRect();

                                simulant.fire(thumb, 'mousedown', {target: thumb, clientY: thumbOffset, which: 1});
                                simulant.fire(document, 'mousemove', {clientY: thumbOffset + 100});
                                simulant.fire(document, 'mouseup');

                                setTimeout(() => {
                                    expect(content.scrollTop).toBe(100);
                                    done();
                                }, 50);
                            }, 100);
                        });
            });
            it("should add dragging class to thumb", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                const {thumbVertical: thumb} = this;
                                const {top: thumbOffset} = thumb.getBoundingClientRect();

                                simulant.fire(thumb, 'mousedown', {target: thumb, clientY: thumbOffset, which: 1});
                                simulant.fire(document, 'mousemove', {clientY: thumbOffset + 100});

                                expect(thumb.classList.contains('dragging')).toBeTruthy();

                                simulant.fire(document, 'mouseup');

                                expect(thumb.classList.contains('dragging')).toBeFalsy();
                                done();
                            }, 100);
                        });
            });
            it("should disable selection on the body element", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                const {thumbVertical: thumb} = this;
                                const {top: thumbOffset} = thumb.getBoundingClientRect();

                                simulant.fire(thumb, 'mousedown', {target: thumb, clientY: thumbOffset, which: 1});
                                simulant.fire(document, 'mousemove', {clientY: thumbOffset + 100});

                                expect(document.body.style.userSelect).toBe("none");

                                simulant.fire(document, 'mouseup');

                                expect(document.body.style.userSelect).toBe("");
                                done();
                            }, 100);
                        });
            });
        });

        describe("when dragging horizontal thumb", function () {
            it("should scroll to respective position", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                const {content, thumbHorizontal: thumb} = this;
                                const {left: thumbOffset} = thumb.getBoundingClientRect();

                                simulant.fire(thumb, 'mousedown', {target: thumb, clientX: thumbOffset, which: 1});
                                simulant.fire(document, 'mousemove', {clientX: thumbOffset + 100});
                                simulant.fire(document, 'mouseup');

                                setTimeout(() => {
                                    expect(content.scrollLeft).toBe(100);
                                    done();
                                }, 50);
                            }, 100);
                        });
            });
            it("should add dragging class to thumb", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                const {thumbHorizontal: thumb} = this;
                                const {left: thumbOffset} = thumb.getBoundingClientRect();

                                simulant.fire(thumb, 'mousedown', {target: thumb, clientX: thumbOffset, which: 1});
                                simulant.fire(document, 'mousemove', {clientX: thumbOffset + 100});

                                expect(thumb.classList.contains('dragging')).toBeTruthy();

                                simulant.fire(document, 'mouseup');

                                expect(thumb.classList.contains('dragging')).toBeFalsy();
                                done();
                            }, 100);
                        });
            });
            it("should disable selection on the body element", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                const {thumbHorizontal: thumb} = this;
                                const {left: thumbOffset} = thumb.getBoundingClientRect();

                                simulant.fire(thumb, 'mousedown', {target: thumb, clientX: thumbOffset, which: 1});
                                simulant.fire(document, 'mousemove', {clientX: thumbOffset + 100});

                                expect(document.body.style.userSelect).toBe("none");

                                simulant.fire(document, 'mouseup');

                                expect(document.body.style.userSelect).toBe("");
                                done();
                            }, 100);
                        });
            });
        });
    });
}
