import expect from "expect";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import simulant from "simulant";
import sinon from "sinon";
import Track, {TYPE_X, TYPE_Y} from "../src/Track";

describe("Track", () => {
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
        render(<Track type={TYPE_X} />, node, function() {
            expect(this.element.getAttribute("class")).toEqual("track trackX");

            render(<Track type={TYPE_Y} />, node, function() {
                expect(this.element.getAttribute("class")).toEqual("track trackY");

                done();
            });
        });
    });

    it("should apply custom class names", done => {
        render(<Track type={TYPE_X} className="helloWorld" />, node, function() {
            expect(this.element.getAttribute("class")).toEqual("track trackX helloWorld");

            done();
        });
    });

    it("`elementRef` property should receive DOMElement reference", done => {
        let elem;
        render(<Track type={TYPE_X} elementRef={ref => (elem = ref)} />, node, function() {
            expect(elem).toBeInstanceOf(HTMLElement);

            done();
        });
    });

    it("should call `onClick` handler", done => {
        let spy = sinon.spy();

        render(
            <Track
                type={TYPE_X}
                style={{
                    width: 100,
                    height: 200,
                    display: "block",
                    position: "relative",
                }}
                onClick={spy}
            />,
            node,
            function() {
                const {top, height, left, width} = this.element.getBoundingClientRect();

                simulant.fire(this.element, "click", {
                    which: 1,
                    clientY: top + height / 2,
                    clientX: left + width / 2,
                });

                expect(spy.callCount).toEqual(1);
                expect(spy.args[0][0]).not.toBeUndefined();
                expect(spy.args[0][1]).toBeInstanceOf(Object);
                expect(spy.args[0][1].axis).toEqual(TYPE_X);
                expect(spy.args[0][1].offset).toEqual(width / 2);

                done();
            }
        );
    });

    it("should not call `onClick` of track was not clicked directly", done => {
        let spy = sinon.spy();
        let div;

        render(
            <Track
                type={TYPE_X}
                style={{
                    width: 100,
                    height: 200,
                    display: "block",
                    position: "relative",
                }}
                onClick={spy}>
                <div ref={ref => (div = ref)} />
            </Track>,
            node,
            function() {
                simulant.fire(div, "click", {});

                expect(spy.callCount).toEqual(0);

                done();
            }
        );
    });
});
