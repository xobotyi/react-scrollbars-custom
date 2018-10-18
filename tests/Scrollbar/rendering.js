import expect                             from 'expect';
import React                              from "react";
import { render, unmountComponentAtNode } from "react-dom";
import Scrollbar                          from "react-scrollbars-custom";
import { getScrollbarWidth }              from '../../src/util/utilities';

export default function performTests() {
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

        describe("when <Scrollbar /> rendered", () => {
            it("should render holder", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.holder).toBeInstanceOf(Node);

                    done();
                });
            });
            it("should render wrapper with overflow:hidden", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.wrapper).toBeInstanceOf(Node);
                    done();
                });
            });
            it("wrapper should have overflow:hidden", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.wrapper.style.overflow).toEqual("hidden");
                    done();
                });
            });
            it("should render content", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.content).toBeInstanceOf(Node);
                    done();
                });
            });
            it("content should have position absolute and stretched to the wrapper's size", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.content.style.left).toEqual("0px");
                    expect(this.content.style.right).toEqual("0px");
                    expect(this.content.style.top).toEqual("0px");
                    expect(this.content.style.bottom).toEqual("0px");
                    expect(this.content.style.position).toEqual("absolute");
                    done();
                });
            });
            it("should render tracks", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.trackVertical).toBeInstanceOf(Node);
                    expect(this.trackHorizontal).toBeInstanceOf(Node);
                    done();
                });
            });
            it("should render thumbs", (done) => {
                render(<Scrollbar />, node, function () {
                    expect(this.thumbVertical).toBeInstanceOf(Node);
                    expect(this.thumbHorizontal).toBeInstanceOf(Node);
                    done();
                });
            });

            it("thumbs should be proper size", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} }>
                            <div style={ {width: 200, height: 200} } />
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                // 92 / 200 * 92 = 42.32
                                expect(this.thumbVertical.style.height).toBe("42px");
                                expect(this.thumbHorizontal.style.width).toBe("42px");

                                done();
                            }, 100);
                        });
            });

            it("thumbs size should not be less than 'minimalThumbsSize'", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } minimalThumbsSize={ 50 }>
                            <div style={ {width: 2000, height: 2000} } />
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
                render(<Scrollbar className="myAwesomeClassName"
                                  wrapperClassName="myAwesomeClassName" contentClassName="myAwesomeClassName"
                                  trackHorizontalClassName="myAwesomeClassName" trackVerticalClassName="myAwesomeClassName"
                                  thumbHorizontalClassName="myAwesomeClassName" thumbVerticalClassName="myAwesomeClassName" />,
                        node,
                        function () {
                            expect(this.holder.classList.contains('myAwesomeClassName')).toBeTruthy();
                            expect(this.wrapper.classList.contains('myAwesomeClassName')).toBeTruthy();
                            expect(this.content.classList.contains('myAwesomeClassName')).toBeTruthy();
                            expect(this.trackHorizontal.classList.contains('myAwesomeClassName')).toBeTruthy();
                            expect(this.trackVertical.classList.contains('myAwesomeClassName')).toBeTruthy();
                            expect(this.thumbHorizontal.classList.contains('myAwesomeClassName')).toBeTruthy();
                            expect(this.thumbVertical.classList.contains('myAwesomeClassName')).toBeTruthy();

                            done();
                        });
            });

            it("should apply if it is an array", (done) => {
                render(<Scrollbar className={ ['awesome', 'classname'] }
                                  wrapperClassName={ ['awesome', 'classname'] } contentClassName={ ['awesome', 'classname'] }
                                  trackHorizontalClassName={ ['awesome', 'classname'] } trackVerticalClassName={ ['awesome', 'classname'] }
                                  thumbHorizontalClassName={ ['awesome', 'classname'] } thumbVerticalClassName={ ['awesome', 'classname'] } />,
                        node,
                        function () {
                            expect(this.holder.classList.contains('awesome')).toBeTruthy();
                            expect(this.holder.classList.contains('classname')).toBeTruthy();
                            expect(this.wrapper.classList.contains('awesome')).toBeTruthy();
                            expect(this.wrapper.classList.contains('classname')).toBeTruthy();
                            expect(this.content.classList.contains('awesome')).toBeTruthy();
                            expect(this.content.classList.contains('classname')).toBeTruthy();
                            expect(this.trackHorizontal.classList.contains('awesome')).toBeTruthy();
                            expect(this.trackHorizontal.classList.contains('classname')).toBeTruthy();
                            expect(this.trackVertical.classList.contains('awesome')).toBeTruthy();
                            expect(this.trackVertical.classList.contains('classname')).toBeTruthy();
                            expect(this.thumbHorizontal.classList.contains('awesome')).toBeTruthy();
                            expect(this.thumbHorizontal.classList.contains('classname')).toBeTruthy();
                            expect(this.thumbVertical.classList.contains('awesome')).toBeTruthy();
                            expect(this.thumbVertical.classList.contains('classname')).toBeTruthy();

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
                            expect(this.trackVertical.getAttribute('style')).toBe("display: none;");
                            expect(this.trackHorizontal.getAttribute('style')).toBe("display: none;");
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
                            expect(this.content.style.marginBottom).toBe(-getScrollbarWidth() + 'px');
                            done();
                        });
            });
        });

        describe("when using custom style", () => {
            it("should use it", (done) => {
                render(<Scrollbar style={ {maxWidth: "100%"} }
                                  wrapperStyle={ {maxWidth: "100%"} } contentStyle={ {maxWidth: "100%"} }
                                  trackVerticalStyle={ {maxWidth: "100%"} } trackHorizontalStyle={ {maxWidth: "100%"} }
                                  thumbVerticalStyle={ {maxWidth: "100%"} } thumbHorizontalStyle={ {maxWidth: "100%"} } />,
                        node,
                        function () {
                            expect(this.holder.style.maxWidth).toBe("100%");
                            expect(this.wrapper.style.maxWidth).toBe("100%");
                            expect(this.content.style.maxWidth).toBe("100%");
                            expect(this.trackHorizontal.style.maxWidth).toBe("100%");
                            expect(this.trackVertical.style.maxWidth).toBe("100%");
                            expect(this.thumbHorizontal.style.maxWidth).toBe("100%");
                            expect(this.thumbVertical.style.maxWidth).toBe("100%");

                            done();
                        });
            });
        });

        describe("when content does not overflow wrapper", () => {
            it("native scrollbars should still be hidden", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} }>
                            <div style={ {width: 50, height: 50} } />
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.content.style.marginRight).toBe(-getScrollbarWidth() + 'px');

                                done();
                            }, 100);
                        });
            });

            it("tracks should be hidden", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} }>
                            <div style={ {width: 50, height: 50} } />
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
                            <div style={ {width: 50, height: 50} } />
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

            it("or `permanentScrollbarY={true}`", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } permanentScrollbarY={ true }>
                            <div style={ {width: 50, height: 50} } />
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.trackVertical.style.display).not.toBe("none");

                                done();
                            }, 100);
                        });
            });

            it("or `permanentScrollbarX={true}`", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } permanentScrollbarX={ true }>
                            <div style={ {width: 50, height: 50} } />
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

        describe("when RTL is set", () => {
            it("left part of content should be hidden", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } rtl>
                            <div style={ {width: 200, height: 200} } />
                        </Scrollbar>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(this.content.style.marginRight).toBe("");
                                expect(this.content.style.marginLeft).toBe(-getScrollbarWidth() + 'px');

                                done();
                            }, 100);
                        });
            });

            it("should override direction value", (done) => {
                let scrollbar = null;
                render(<div style={ {direction: "rtl"} }>
                            <Scrollbar style={ {width: 100, height: 100} } ref={ (ref) => {scrollbar = ref;} } rtl={ false }>
                                <div style={ {width: 200, height: 200} } />
                            </Scrollbar>
                        </div>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(scrollbar.holder.classList.contains("ScrollbarsCustom-RTL")).toBeFalsy();

                                done();
                            }, 100);
                        });
            });
        });

        describe("when RTL is not set", () => {
            it("should autodetect direction (when set rtl)", (done) => {
                let scrollbar = null;
                render(<div style={ {direction: "rtl"} }>
                            <Scrollbar style={ {width: 100, height: 100} } ref={ (ref) => {scrollbar = ref;} }>
                                <div style={ {width: 200, height: 200} } />
                            </Scrollbar>
                        </div>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(scrollbar.holder.classList.contains("ScrollbarsCustom-RTL")).toBeTruthy();

                                done();
                            }, 100);
                        });
            });

            it("should autodetect direction (when set ltr)", (done) => {
                let scrollbar = null;
                render(<div style={ {direction: "ltr"} }>
                            <Scrollbar style={ {width: 100, height: 100} } ref={ (ref) => {scrollbar = ref;} } rtl={ false }>
                                <div style={ {width: 200, height: 200} } />
                            </Scrollbar>
                        </div>,
                        node,
                        function () {
                            setTimeout(() => {
                                expect(scrollbar.holder.classList.contains("ScrollbarsCustom-RTL")).toBeFalsy();

                                done();
                            }, 100);
                        });
            });
        });

        describe("only vertical scroll should be blocked", () => {
            it("if noScrollY={ true } is passed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } noScrollY={ true }>
                            <div style={ {width: 200, height: 200} } />
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
            it("if `scrollY={ true }` and `permanentScrollbarY={true}` are passed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } noScrollY={ true } permanentScrollbarY={ true }>
                            <div style={ {width: 200, height: 200} } />
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
            it("if `noScrollX={ true }` is passed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } noScrollX={ true }>
                            <div style={ {width: 200, height: 200} } />
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
            it("if `noScrollX={ true }` and `permanentScrollbarX={true}` are passed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } noScrollX={ true } permanentScrollbarX={ true }>
                            <div style={ {width: 200, height: 200} } />
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
                            <div style={ {width: 200, height: 200} } />
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

        describe("both tracks should be displayed without thumb", () => {
            it("if `noScroll` and `permanentScrollbars={true}`", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } noScroll permanentScrollbars>
                            <div style={ {width: 200, height: 200} } />
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

        describe("update should be performed", () => {
            it("if props has changed", (done) => {
                class TestComponent extends React.Component
                {
                    constructor(props) {
                        super(props);

                        this.state = {noScroll: false};
                    }

                    render() {
                        return <Scrollbar style={ {width: 100, height: 100} } noScroll={ this.state.noScroll } ref={ (ref) => {this.scrollbar = ref;} }>
                            <div style={ {width: 200, height: 200} } />
                        </Scrollbar>;
                    };
                }

                render(<TestComponent />,
                        node,
                        function () {
                            this.setState({noScroll: true});

                            setTimeout(() => {
                                expect(this.scrollbar.trackHorizontal.style.display).toBe("none");
                                expect(this.scrollbar.trackVertical.style.display).toBe("none");
                                expect(this.scrollbar.content.style.overflowX).toBe("hidden");
                                expect(this.scrollbar.content.style.overflowY).toBe("hidden");
                                expect(this.scrollbar.content.style.overflow).toBe("hidden");
                                expect(this.scrollbar.content.style.marginBottom).toBe("");
                                expect(this.scrollbar.content.style.marginRight).toBe("");

                                done();
                            }, 100);
                        });
            });
        });
    });
}
