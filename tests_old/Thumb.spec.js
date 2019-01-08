import expect from "expect";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import simulant from "simulant";
import sinon from "sinon";
import Thumb from "../src/Thumb";
import Track, {TYPE_X, TYPE_Y} from "../src/Track";

describe("Thumb", () => {
    let node;
    beforeEach(() => {
        node = document.createElement("div");
        document.body.appendChild(node);
    });
    afterEach(() => {
        unmountComponentAtNode(node);
        document.body.removeChild(node);
    });

    it("should render track", done => {
        render(<Track type={TYPE_X} />, node, function() {
            done();
        });
    });

    it("should apply default class names", done => {
        render(<Thumb type={TYPE_X} />, node, function() {
            expect(this.element.getAttribute("class")).toEqual("thumb thumbX");

            render(<Thumb type={TYPE_Y} />, node, function() {
                expect(this.element.getAttribute("class")).toEqual("thumb thumbY");

                done();
            });
        });
    });

    it("should apply custom class names", done => {
        render(<Thumb type={TYPE_X} className="helloWorld" />, node, function() {
            expect(this.element.getAttribute("class")).toEqual("thumb thumbX helloWorld");

            done();
        });
    });

    it("`elementRef` property should receive DOMElement reference", done => {
        let elem;
        render(<Thumb type={TYPE_X} elementRef={ref => (elem = ref)} />, node, function() {
            expect(elem).toBeInstanceOf(HTMLElement);

            done();
        });
    });

    it("should call `onClick` handler", done => {
        let spy = sinon.spy(),
            thumb;

        render(
            <Track
                type={TYPE_X}
                style={{
                    width: 100,
                    height: 100,
                    margin: 0,
                    padding: 0,
                    display: "block",
                    position: "relative",
                }}>
                <Thumb
                    type={TYPE_X}
                    style={{
                        width: 40,
                        height: 40,
                        margin: 0,
                        padding: 0,
                        display: "block",
                        position: "absolute",
                    }}
                    onDragStart={spy}
                    elementRef={ref => (thumb = ref)}
                />
            </Track>,
            node,
            function() {
                const {top, height, left, width} = thumb.getBoundingClientRect();

                simulant.fire(thumb, "mousedown", {
                    which: 1,
                    clientY: top + height / 2,
                    clientX: left + width / 2,
                });

                expect(spy.callCount).toEqual(1);
                expect(spy.args[0][0]).toBeInstanceOf(Object);
                expect(spy.args[0][0].axis).toEqual(TYPE_X);
                expect(spy.args[0][0].offset).toEqual(width / 2);

                done();
            }
        );
    });

    it("should not call `onDragStart` handler if pressed not LMB", done => {
        let spy = sinon.spy(),
            thumb;

        render(
            <Track
                type={TYPE_X}
                style={{
                    width: 100,
                    height: 100,
                    margin: 0,
                    padding: 0,
                    display: "block",
                    position: "relative",
                }}>
                <Thumb
                    type={TYPE_X}
                    style={{
                        width: 40,
                        height: 40,
                        margin: 0,
                        padding: 0,
                        display: "block",
                        position: "absolute",
                    }}
                    onDragStart={spy}
                    elementRef={ref => (thumb = ref)}
                />
            </Track>,
            node,
            function() {
                simulant.fire(thumb, "mousedown", {button: 2, which: 2});

                expect(spy.callCount).toEqual(0);

                done();
            }
        );
    });

    it("should call `handleDragEnd` when component unmounted", done => {
        let thumb;
        render(
            <Track
                type={TYPE_X}
                style={{
                    width: 100,
                    height: 100,
                    margin: 0,
                    padding: 0,
                    display: "block",
                    position: "relative",
                }}>
                <Thumb
                    type={TYPE_X}
                    style={{
                        width: 40,
                        height: 40,
                        margin: 0,
                        padding: 0,
                        display: "block",
                        position: "absolute",
                    }}
                    ref={ref => (thumb = ref)}
                />
            </Track>,
            node,
            function() {
                let spy = sinon.spy(thumb, "handleDragEnd");
                unmountComponentAtNode(node);

                setTimeout(() => {
                    expect(spy.callCount).toEqual(1);

                    done();
                }, 100);
            }
        );
    });

    it("should call `onDragStart`, `onDrag`, `onDragEnd` after each other when dragging performed", done => {
        let onDragStart = sinon.spy(),
            onDragEnd = sinon.spy(),
            onDrag = sinon.spy(),
            thumb;

        render(
            <Track
                type={TYPE_X}
                style={{
                    width: 100,
                    height: 100,
                    margin: 0,
                    padding: 0,
                    display: "block",
                    position: "relative",
                }}>
                <Thumb
                    type={TYPE_X}
                    style={{
                        width: 40,
                        height: 40,
                        margin: 0,
                        padding: 0,
                        display: "block",
                        position: "absolute",
                    }}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDrag={onDrag}
                    elementRef={ref => (thumb = ref)}
                />
            </Track>,
            node,
            function() {
                const {top, height, left, width} = thumb.getBoundingClientRect();

                simulant.fire(thumb, "mousedown", {
                    which: 1,
                    clientY: top + height / 2,
                    clientX: left + width / 2,
                });
                simulant.fire(document, "mousemove", {
                    which: 1,
                    clientY: top + height / 2 + 5,
                    clientX: left + width / 2 + 5,
                });
                simulant.fire(document, "mouseup", {
                    which: 1,
                    clientY: top + height / 2 + 5,
                    clientX: left + width / 2 + 5,
                });

                setTimeout(() => {
                    expect(onDragStart.callCount).toEqual(1);
                    expect(onDragStart.args[0][0]).toBeInstanceOf(Object);
                    expect(onDragStart.args[0][0].axis).toEqual(TYPE_X);
                    expect(onDragStart.args[0][0].offset).toEqual(width / 2);

                    expect(onDrag.callCount).toEqual(1);
                    expect(onDrag.args[0][0]).toBeInstanceOf(Object);
                    expect(onDrag.args[0][0].axis).toEqual(TYPE_X);
                    expect(onDrag.args[0][0].offset).toEqual(width / 2 + 5);

                    expect(onDragEnd.callCount).toEqual(1);
                    expect(onDragEnd.args[0][0]).toBeInstanceOf(Object);
                    expect(onDragEnd.args[0][0].axis).toEqual(TYPE_X);

                    expect(onDrag.calledAfter(onDragStart)).toBeTruthy();
                    expect(onDragEnd.calledAfter(onDrag)).toBeTruthy();

                    done();
                }, 100);
            }
        );
    });

    it("should not call `onDrag` if `onmousemove` performed after `onmouseup`", done => {
        let onDragStart = sinon.spy(),
            onDragEnd = sinon.spy(),
            onDrag = sinon.spy(),
            thumb;

        render(
            <Track
                type={TYPE_X}
                style={{
                    width: 100,
                    height: 100,
                    margin: 0,
                    padding: 0,
                    display: "block",
                    position: "relative",
                }}>
                <Thumb
                    type={TYPE_X}
                    style={{
                        width: 40,
                        height: 40,
                        margin: 0,
                        padding: 0,
                        display: "block",
                        position: "absolute",
                    }}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDrag={onDrag}
                    elementRef={ref => (thumb = ref)}
                />
            </Track>,
            node,
            function() {
                const {top, height, left, width} = thumb.getBoundingClientRect();

                simulant.fire(thumb, "mousedown", {
                    which: 1,
                    clientY: top + height / 2,
                    clientX: left + width / 2,
                });
                simulant.fire(document, "mouseup", {
                    which: 1,
                    clientY: top + height / 2 + 5,
                    clientX: left + width / 2 + 5,
                });
                simulant.fire(document, "mousemove", {
                    which: 1,
                    clientY: top + height / 2 + 5,
                    clientX: left + width / 2 + 5,
                });

                setTimeout(() => {
                    expect(onDragStart.callCount).toEqual(1);
                    expect(onDragStart.args[0][0]).toBeInstanceOf(Object);
                    expect(onDragStart.args[0][0].axis).toEqual(TYPE_X);
                    expect(onDragStart.args[0][0].offset).toEqual(width / 2);

                    expect(onDragEnd.callCount).toEqual(1);
                    expect(onDragEnd.args[0][0]).toBeInstanceOf(Object);
                    expect(onDragEnd.args[0][0].axis).toEqual(TYPE_X);

                    expect(onDrag.callCount).toEqual(0);

                    expect(onDragEnd.calledAfter(onDragStart)).toBeTruthy();

                    done();
                }, 100);
            }
        );
    });

    it("should not call `onDrag` if `onmousemove` performed after `onmouseup` even if handled was not removed (somewhy)", done => {
        let onDragStart = sinon.spy(),
            onDragEnd = sinon.spy(),
            onDrag = sinon.spy(),
            thumbInstance,
            thumb;

        render(
            <Track
                type={TYPE_X}
                style={{
                    width: 100,
                    height: 100,
                    margin: 0,
                    padding: 0,
                    display: "block",
                    position: "relative",
                }}>
                <Thumb
                    type={TYPE_X}
                    style={{
                        width: 40,
                        height: 40,
                        margin: 0,
                        padding: 0,
                        display: "block",
                        position: "absolute",
                    }}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDrag={onDrag}
                    elementRef={ref => (thumb = ref)}
                    ref={ref => (thumbInstance = ref)}
                />
            </Track>,
            node,
            function() {
                const {top, height, left, width} = thumb.getBoundingClientRect();

                simulant.fire(thumb, "mousedown", {
                    which: 1,
                    clientY: top + height / 2,
                    clientX: left + width / 2,
                });
                thumbInstance.isDragging = false;
                simulant.fire(document, "mousemove", {
                    which: 1,
                    clientY: top + height / 2 + 5,
                    clientX: left + width / 2 + 5,
                });

                setTimeout(() => {
                    expect(onDragStart.callCount).toEqual(1);
                    expect(onDragStart.args[0][0]).toBeInstanceOf(Object);
                    expect(onDragStart.args[0][0].axis).toEqual(TYPE_X);
                    expect(onDragStart.args[0][0].offset).toEqual(width / 2);

                    expect(onDrag.callCount).toEqual(0);

                    done();
                }, 100);
            }
        );
    });

    it("should not call `onDrag` if mouse button changed in progredd", done => {
        let onDragStart = sinon.spy(),
            onDragEnd = sinon.spy(),
            onDrag = sinon.spy(),
            thumbInstance,
            thumb;

        render(
            <Track
                type={TYPE_X}
                style={{
                    width: 100,
                    height: 100,
                    margin: 0,
                    padding: 0,
                    display: "block",
                    position: "relative",
                }}>
                <Thumb
                    type={TYPE_X}
                    style={{
                        width: 40,
                        height: 40,
                        margin: 0,
                        padding: 0,
                        display: "block",
                        position: "absolute",
                    }}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDrag={onDrag}
                    elementRef={ref => (thumb = ref)}
                    ref={ref => (thumbInstance = ref)}
                />
            </Track>,
            node,
            function() {
                const {top, height, left, width} = thumb.getBoundingClientRect();

                simulant.fire(thumb, "mousedown", {
                    which: 1,
                    clientY: top + height / 2,
                    clientX: left + width / 2,
                });
                simulant.fire(document, "mousemove", {
                    which: 1,
                    clientY: top + height / 2 + 5,
                    clientX: left + width / 2 + 5,
                });
                simulant.fire(document, "mousemove", {
                    button: 2,
                    which: 2,
                    clientY: top + height / 2 + 5,
                    clientX: left + width / 2 + 5,
                });

                setTimeout(() => {
                    expect(onDragStart.callCount).toEqual(1);
                    expect(onDragStart.args[0][0]).toBeInstanceOf(Object);
                    expect(onDragStart.args[0][0].axis).toEqual(TYPE_X);
                    expect(onDragStart.args[0][0].offset).toEqual(width / 2);

                    expect(onDrag.callCount).toEqual(1);

                    done();
                }, 100);
            }
        );
    });
});
