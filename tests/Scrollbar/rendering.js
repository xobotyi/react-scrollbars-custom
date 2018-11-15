import expect from "expect";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Scrollbar from "react-scrollbars-custom";

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

        describe("holder", () => {
            it("should be rendered", done => {
                render(<Scrollbar />, node, function() {
                    expect(this.holderEl).toBeInstanceOf(Node);

                    done();
                });
            });

            it("width passed tagName or div instead", done => {
                render(<Scrollbar />, node, function() {
                    expect(this.holderEl.tagName).toBe("DIV");

                    render(<Scrollbar tagName="span" />, node, function() {
                        expect(this.holderEl.tagName).toBe("SPAN");

                        done();
                    });
                });
            });

            it("and styles", done => {
                render(<Scrollbar style={{position: "absolute", top: 3}} />, node, function() {
                    expect(this.holderEl.style.position).toBe("absolute");
                    expect(this.holderEl.style.top).toBe("3px");

                    done();
                });
            });

            it("except direction when `rtl` passed", done => {
                render(<Scrollbar style={{direction: "lrt", top: 3}} rtl />, node, function() {
                    expect(this.holderEl.style.direction).toBe("rtl");
                    expect(this.holderEl.style.top).toBe("3px");

                    done();
                });
            });
        });

        describe("wrapper", () => {
            it("should be rendered", done => {
                render(<Scrollbar />, node, function() {
                    expect(this.wrapperEl).toBeInstanceOf(Node);

                    done();
                });
            });

            it("width `overflow:hidden;` and `position:relative;`", done => {
                render(<Scrollbar />, node, function() {
                    expect(this.wrapperEl.style.overflow).toBe("hidden");
                    expect(this.wrapperEl.style.position).toBe("relative");

                    done();
                });
            });

            it("even if default styles turned off", done => {
                render(<Scrollbar noDefaultStyles />, node, function() {
                    expect(this.wrapperEl.style.overflow).toBe("hidden");
                    expect(this.wrapperEl.style.position).toBe("relative");

                    done();
                });
            });

            it("in spite of passed styles", done => {
                render(<Scrollbar wrapperProps={{style: {overflow: "scroll", position: "fixed"}}} />, node, function() {
                    expect(this.wrapperEl.style.overflow).toBe("hidden");
                    expect(this.wrapperEl.style.position).toBe("relative");

                    done();
                });
            });
        });

        describe("content", () => {
            it("should be rendered", done => {
                render(<Scrollbar />, node, function() {
                    expect(this.contentEl).toBeInstanceOf(Node);

                    done();
                });
            });

            it("width minimal required styles", done => {
                render(<Scrollbar />, node, function() {
                    expect(this.contentEl.style.position).toBe("absolute");
                    expect(this.contentEl.style.top).toBe("0px");
                    expect(this.contentEl.style.left).toBe("0px");
                    expect(this.contentEl.style.right).toBe("0px");
                    expect(this.contentEl.style.bottom).toBe("0px");

                    done();
                });
            });

            it("even if default styles turned off", done => {
                render(<Scrollbar noDefaultStyles />, node, function() {
                    expect(this.contentEl.style.position).toBe("absolute");
                    expect(this.contentEl.style.top).toBe("0px");
                    expect(this.contentEl.style.left).toBe("0px");
                    expect(this.contentEl.style.right).toBe("0px");
                    expect(this.contentEl.style.bottom).toBe("0px");

                    done();
                });
            });

            it("in spite of passed styles", done => {
                render(
                    <Scrollbar wrapperProps={{style: {position: "fixed", top: 20, left: 20, right: 20, bottom: 20}}} />,
                    node,
                    function() {
                        expect(this.contentEl.style.position).toBe("absolute");
                        expect(this.contentEl.style.top).toBe("0px");
                        expect(this.contentEl.style.left).toBe("0px");
                        expect(this.contentEl.style.right).toBe("0px");
                        expect(this.contentEl.style.bottom).toBe("0px");

                        done();
                    }
                );
            });
        });

        describe("native mode", () => {
            it("should render only single div", done => {
                render(<Scrollbar native />, node, function() {
                    expect(this.contentEl).toBeInstanceOf(Node);
                    expect(this.contentEl.classList.contains("native")).toBeTruthy();
                    expect(this.wrapperEl).toBeUndefined();
                    expect(this.trackXEl).toBeUndefined();
                    expect(this.trackYEl).toBeUndefined();
                    expect(this.thumbXEl).toBeUndefined();
                    expect(this.thumbYEl).toBeUndefined();

                    done();
                });
            });
        });

        describe("size translation", () => {
            it("should translate content sizes to holder", done => {
                render(
                    <Scrollbar translateContentSizesToHolder>
                        <div style={{width: 50, height: 200, padding: 0, margin: 0}} />
                    </Scrollbar>,
                    node,
                    function() {
                        setTimeout(() => {
                            // waiting till update will be performed
                            expect(this.holderEl.clientWidth).toBe(this.contentEl.scrollWidth);
                            expect(this.holderEl.clientHeight).toBe(this.contentEl.scrollHeight);

                            done();
                        }, 20);
                    }
                );
            });
        });

        describe("tracks", () => {
            it("should not be rendered if scrolling not needed", done => {
                render(
                    <Scrollbar style={{width: 1000, height: 1000}}>
                        <div style={{width: 100, height: 100}} />
                    </Scrollbar>,
                    node,
                    function() {
                        setTimeout(() => {
                            // waiting till update will be performed
                            expect(this.trackXEl).toBeNull();
                            expect(this.trackYEl).toBeNull();

                            done();
                        }, 20);
                    }
                );
            });

            it("should not be rendered if scrolling not needed [vertical]", done => {
                render(
                    <Scrollbar style={{width: 100, height: 100}}>
                        <div style={{width: 50, height: 200}} />
                    </Scrollbar>,
                    node,
                    function() {
                        setTimeout(() => {
                            // waiting till update will be performed
                            expect(this.trackXEl).toBeNull();
                            expect(this.trackYEl).not.toBeNull();

                            done();
                        }, 20);
                    }
                );
            });

            it("should not be rendered if scrolling not needed [horizontal]", done => {
                render(
                    <Scrollbar style={{width: 100, height: 100}}>
                        <div style={{width: 200, height: 50}} />
                    </Scrollbar>,
                    node,
                    function() {
                        setTimeout(() => {
                            // waiting till update will be performed
                            expect(this.trackXEl).not.toBeNull();
                            expect(this.trackYEl).toBeNull();

                            done();
                        }, 20);
                    }
                );
            });

            it("should only hide tracks if `removeTracksWhenNotUsed={false}` [vertical]", done => {
                render(
                    <Scrollbar style={{width: 100, height: 100}} removeTracksWhenNotUsed={false}>
                        <div style={{width: 50, height: 200}} />
                    </Scrollbar>,
                    node,
                    function() {
                        setTimeout(() => {
                            // waiting till update will be performed
                            expect(this.trackXEl).not.toBeNull();
                            expect(this.trackYEl).not.toBeNull();
                            expect(this.trackXEl.style.display).toBe("none");
                            expect(this.trackYEl.style.display).not.toBe("none");

                            done();
                        }, 20);
                    }
                );
            });

            it("should only hide tracks if `removeTracksWhenNotUsed={false}` [horizontal]", done => {
                render(
                    <Scrollbar style={{width: 100, height: 100}} removeTracksWhenNotUsed={false}>
                        <div style={{width: 200, height: 50}} />
                    </Scrollbar>,
                    node,
                    function() {
                        setTimeout(() => {
                            // waiting till update will be performed
                            expect(this.trackXEl).not.toBeNull();
                            expect(this.trackYEl).not.toBeNull();
                            expect(this.trackXEl.style.display).not.toBe("none");
                            expect(this.trackYEl.style.display).toBe("none");

                            done();
                        }, 20);
                    }
                );
            });
        });
    });
}
