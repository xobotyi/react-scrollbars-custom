import expect from "expect";
import React from "react";
import {findDOMNode, render, unmountComponentAtNode} from "react-dom";
import {getInnerHeight, getInnerSizes, getInnerWidth} from "../src/util/getInnerSizes";

describe("getInnerSizes", () => {
    let node;
    beforeEach(() => {
        node = document.createElement("div");
        document.body.appendChild(node);
    });
    afterEach(() => {
        unmountComponentAtNode(node);
        document.body.removeChild(node);
    });

    describe("getInnerHeight()", () => {
        it("returns the height of an element without padding", done => {
            render(
                <div
                    style={{
                        width: 200,
                        height: 200,
                        padding: 20,
                        boxSizing: "border-box",
                    }}
                />,
                node,
                function() {
                    expect(getInnerHeight(findDOMNode(this))).toBe(160);
                    done();
                }
            );
        });
    });

    describe("getInnerWidth()", () => {
        it("returns the width of an element without padding", done => {
            render(
                <div
                    style={{
                        width: 200,
                        height: 200,
                        padding: 20,
                        boxSizing: "border-box",
                    }}
                />,
                node,
                function() {
                    expect(getInnerWidth(findDOMNode(this))).toBe(160);
                    done();
                }
            );
        });
    });

    describe("getInnerSizes()", () => {
        it("returns the width and height of an element without padding", done => {
            render(
                <div
                    style={{
                        width: 200,
                        height: 200,
                        padding: 20,
                        boxSizing: "border-box",
                    }}
                />,
                node,
                function() {
                    expect(getInnerSizes(findDOMNode(this))).toMatchObject({
                        width: 160,
                        height: 160,
                    });
                    done();
                }
            );
        });
    });
});
