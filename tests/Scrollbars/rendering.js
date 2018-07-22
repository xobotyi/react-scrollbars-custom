import expect                                          from "expect";
import React                                           from "react";
import { findDOMNode, render, unmountComponentAtNode } from "react-dom";
import { Scrollbar }                                   from "react-scrollbars-custom";

export default function createTests(scrollbarWidth) {
    describe("rendering", () => {
        let node;
        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });
        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        describe("when <Scrollbar /> is rendered", function () {
            it("renders content wrapper", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.wrapper).toBeInstanceOf(Node);

                    done();
                });
            });
            it("renders content", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.content).toBeInstanceOf(Node);

                    done();
                });
            });
            it("content should have an absolute positioning", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.content.style.position).toBe("absolute");
                    expect(this.content.style.top).toBe("0px");
                    expect(this.content.style.left).toBe("0px");
                    expect(this.content.style.right).toBe("0px");
                    expect(this.content.style.bottom).toBe("0px");

                    done();
                });
            });
            it("renders tracks", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.trackVertical).toBeInstanceOf(Node);
                    expect(this.trackHorizontal).toBeInstanceOf(Node);

                    done();
                });
            });
            it("renders thumbs", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.thumbVertical).toBeInstanceOf(Node);
                    expect(this.thumbHorizontal).toBeInstanceOf(Node);

                    done();
                });
            });
            it("renders thumbs with proper size", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} }>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                // 92 / 200 * 92 = 42.32
                                expect(this.thumbVertical.style.height).toBe("43px");
                                expect(this.thumbHorizontal.style.width).toBe("43px");

                                done();
                            }, 50);
                        });
            });
            it("thumbs size should not be less than `thumbSizeMin`", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } thumbSizeMin={ 50 }>
                            <div style={ {width: 2000, height: 2000} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.thumbVertical.style.height).toBe("50px");
                                expect(this.thumbHorizontal.style.width).toBe("50px");

                                done();
                            }, 50);
                        });
            });
        });

        describe("when using custom tagName", () => {
            it("should use it", (done) => {
                render(<Scrollbar tagName="label" />,
                        node,
                        function () {
                            expect(findDOMNode(this).tagName.toLowerCase()).toBe("label");

                            done();
                        });
            });
        });

        describe("when using custom style", () => {
            it("should use it except the default styles", (done) => {
                render(<Scrollbar style={ {maxWidth: "100%"} } />,
                        node,
                        function () {
                            expect(findDOMNode(this).style.maxWidth).toBe("100%");
                            expect(findDOMNode(this).style.display).toBe("grid");

                            done();
                        });
            });
        });

        describe("when content does not overflow wrapper", () => {
            it("tracks should be hidden", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} }>
                            <div style={ {width: 50, height: 50} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackVertical.style.display).toBe("none");
                                expect(this.trackHorizontal.style.display).toBe("none");

                                done();
                            }, 50);
                        });
            });

            it("except situation when `permanentScrollbars={true}`", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } permanentScrollbars={ true }>
                            <div style={ {width: 50, height: 50} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackVertical.style.display).not.toBe("none");
                                expect(this.trackHorizontal.style.display).not.toBe("none");

                                done();
                            }, 50);
                        });
            });

            it("or `permanentScrollbarVertical={true}`", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } permanentScrollbarVertical={ true }>
                            <div style={ {width: 50, height: 50} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackVertical.style.display).not.toBe("none");

                                done();
                            }, 50);
                        });
            });

            it("or `permanentScrollbarHorizontal={true}`", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } permanentScrollbarHorizontal={ true }>
                            <div style={ {width: 50, height: 50} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackHorizontal.style.display).not.toBe("none");

                                done();
                            }, 50);
                        });
            });
        });

        describe("only vertical scroll should be blocked", () => {
            it("if scrollY={false} is passed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } scrollY={ false }>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackVertical.style.display).toBe("none");
                                expect(this.content.style.overflowY).toBe("hidden");
                                expect(this.content.style.marginRight).toBe("");
                                expect(this.trackHorizontal.style.display).not.toBe("none");
                                expect(this.content.style.overflowX).not.toBe("hidden");
                                expect(this.content.style.marginBottom).not.toBe("");

                                done();
                            }, 50);
                        });
            });
        });

        describe("only horizontal scroll should be blocked", () => {
            it("if scrollX={false} is passed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } scrollX={ false }>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackVertical.style.display).not.toBe("none");
                                expect(this.content.style.overflowY).not.toBe("hidden");
                                expect(this.content.style.marginRight).not.toBe("");
                                expect(this.trackHorizontal.style.display).toBe("none");
                                expect(this.content.style.overflowX).toBe("hidden");
                                expect(this.content.style.marginBottom).toBe("");

                                done();
                            }, 50);
                        });
            });
        });

        describe("both scrolls should be blocked", () => {
            it("or no noScroll is passed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } noScroll>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackHorizontal.style.display).toBe("none");
                                expect(this.trackVertical.style.display).toBe("none");
                                expect(this.content.style.overflowX).toBe("hidden");
                                expect(this.content.style.overflowY).toBe("hidden");
                                expect(this.content.style.overflow).toBe("hidden");
                                expect(this.content.style.marginBottom).toBe("");
                                expect(this.content.style.marginRight).toBe("");

                                done();
                            }, 50);
                        });
            });
        });
    });
}
