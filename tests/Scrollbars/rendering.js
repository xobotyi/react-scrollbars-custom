import expect                             from "expect";
import React                              from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Scrollbar }                      from "react-scrollbars-custom";

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
                            }, 100);
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
                            }, 100);
                        });
            });
        });

        describe("when using custom tagName", () => {
            it("should use it", (done) => {
                render(<Scrollbar tagName="label" />,
                        node,
                        function () {
                            expect(this.holder.tagName.toLowerCase()).toBe("label");

                            done();
                        });
            });
        });
        describe("when using custom classname", () => {
            it("should apply if it is string", (done) => {
                render(<Scrollbar className="myAwesomeClassName" />,
                        node,
                        function () {
                            expect(this.holder.classList.contains('myAwesomeClassName')).toBeTruthy();

                            done();
                        });
            });
            it("should apply if it is an array", (done) => {
                render(<Scrollbar className={ ['awesome', 'classname'] } />,
                        node,
                        function () {
                            expect(this.holder.classList.contains('awesome')).toBeTruthy();
                            expect(this.holder.classList.contains('classname')).toBeTruthy();

                            done();
                        });
            });
        });

        describe("when defining gridless", () => {
            it("should use non gridless styles", (done) => {
                render(<Scrollbar gridless />,
                        node,
                        function () {
                            expect(this.holder.style.display).not.toBe("grid");
                            expect(this.holder.style.gridTemplateColumns).not.toBe("1fr min-content");
                            expect(this.holder.style.gridTemplateRows).not.toBe("1fr min-content");

                            done();
                        });
            });
        });

        describe("when disabling default styles", () => {
            it("holder should has no styles", (done) => {
                render(<Scrollbar defaultStyles={ false } />,
                        node,
                        function () {
                            expect(this.holder.getAttribute('style')).toBe(null);
                            done();
                        });
            });
            it("tracks should has no styles", (done) => {
                render(<Scrollbar defaultStyles={ false } />,
                        node,
                        function () {
                            expect(this.trackVertical.getAttribute('style')).toBe(null);
                            expect(this.trackHorizontal.getAttribute('style')).toBe(null);
                            done();
                        });
            });
            it("wrapper should has position relative and overflow hidden", (done) => {
                render(<Scrollbar defaultStyles={ false } />,
                        node,
                        function () {
                            expect(this.wrapper.style.position).toBe("relative");
                            expect(this.wrapper.style.overflow).toBe("hidden");
                            done();
                        });
            });
            it("content should still has default styles", (done) => {
                render(<Scrollbar defaultStyles={ false } />,
                        node,
                        function () {
                            expect(this.content.style.position).toBe("absolute");
                            expect(this.content.style.top).toBe(0 + 'px');
                            expect(this.content.style.bottom).toBe(0 + 'px');
                            expect(this.content.style.left).toBe(0 + 'px');
                            expect(this.content.style.right).toBe(0 + 'px');
                            expect(this.content.style.overflow).toBe("scroll");
                            expect(this.content.style.marginRight).toBe(-scrollbarWidth + 'px');
                            expect(this.content.style.marginBottom).toBe(-scrollbarWidth + 'px');
                            done();
                        });
            });
        });

        describe("when using custom style", () => {
            it("should use it except the default styles", (done) => {
                render(<Scrollbar style={ {maxWidth: "100%"} } />,
                        node,
                        function () {
                            expect(this.holder.style.maxWidth).toBe("100%");
                            expect(this.holder.style.display).toBe("grid");

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
                            }, 100);
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
                            }, 100);
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
                            }, 100);
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
                            }, 100);
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
                            }, 100);
                        });
            });
        });

        describe("vertical track should be displayed without thumb", () => {
            it("if `scrollY={false}` and `permanentScrollbarVertical={true}` are passed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } scrollY={ false } permanentScrollbarVertical>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackVertical.style.display).toBe("");
                                expect(this.thumbVertical.style.display).toBe("none");
                                expect(this.content.style.overflowY).toBe("hidden");
                                expect(this.content.style.marginRight).toBe("");

                                done();
                            }, 100);
                        });
            });
        });

        describe("only horizontal scroll should be blocked", () => {
            it("if `scrollX={false}` is passed", (done) => {
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
                            }, 100);
                        });
            });

        });

        describe("horizontal track should be displayed without thumb", () => {
            it("if `scrollX={false}` and `permanentScrollbarHorizontal={true}` are passed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } scrollX={ false } permanentScrollbarHorizontal>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackHorizontal.style.display).toBe("");
                                expect(this.thumbHorizontal.style.display).toBe("none");
                                expect(this.content.style.overflowX).toBe("hidden");
                                expect(this.content.style.marginBottom).toBe("");

                                done();
                            }, 100);
                        });
            });
        });

        describe("both scrolls should be blocked", () => {
            it("or no `noScroll` is passed", (done) => {
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
                            }, 100);
                        });
            });

        });
        describe("both tracks should be displayed withut thumb", () => {
            it("if `noScroll` and `permanentScrollbars={true}`", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } noScroll permanentScrollbars>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackHorizontal.style.display).toBe("");
                                expect(this.trackVertical.style.display).toBe("");
                                expect(this.thumbHorizontal.style.display).toBe("none");
                                expect(this.thumbVertical.style.display).toBe("none");
                                expect(this.content.style.overflowX).toBe("hidden");
                                expect(this.content.style.overflowY).toBe("hidden");
                                expect(this.content.style.overflow).toBe("hidden");
                                expect(this.content.style.marginBottom).toBe("");
                                expect(this.content.style.marginRight).toBe("");

                                done();
                            }, 100);
                        });
            });
        });
    });
}
