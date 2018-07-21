import React                              from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Scrollbar }                      from "react-scrollbars-custom";

export default function createTests(scrollbarWidth) {
    describe("scrolling", () => {
        let node;
        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });
        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        describe("when scrolling vertically", function () {
            it("onScroll should be called", (done) => {
                const spy = chai.spy();
                render(<Scrollbar style={ {width: 100, height: 100} } onScroll={ spy } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            this.scrollTop = 50;
                            setTimeout(() => {
                                spy.should.have.been.called.once;
                                done();
                            }, 50);
                        });
            });

            it("onScrollStart should be called once", (done) => {
                const spy = chai.spy();
                render(<Scrollbar style={ {width: 100, height: 100} } onScrollStart={ spy } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            let offset = 0;
                            const interval = setInterval(() => {
                                this.scrollTop = ++offset;

                                if (this.scrollTop >= 10) {
                                    clearInterval(interval);
                                    spy.should.have.been.called.once;
                                    done();
                                }
                            }, 5);
                        });
            });

            it("onScrollStop should be called once ", (done) => {
                const spy = chai.spy();
                render(<Scrollbar style={ {width: 100, height: 100} } onScrollStop={ spy } scrollDetectionThreshold={ 50 } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            let offset = 0;
                            const interval = setInterval(() => {
                                this.scrollTop = ++offset;

                                if (this.scrollTop >= 10) {
                                    clearInterval(interval);

                                    setTimeout(() => {
                                        spy.should.have.been.called.once;
                                        done();
                                    }, 75);
                                }
                            }, 5);
                        });
            });
        });

        describe("when scrolling horizontally", function () {
            it("onScroll should be called", (done) => {
                const spy = chai.spy();
                render(<Scrollbar style={ {width: 100, height: 100} } onScroll={ spy } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            this.scrollLeft = 50;
                            setTimeout(() => {
                                spy.should.have.been.called.once;
                                done();
                            }, 50);
                        });
            });

            it("onScrollStart should be called once", (done) => {
                const spy = chai.spy();
                render(<Scrollbar style={ {width: 100, height: 100} } onScrollStart={ spy } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            let offset = 0;
                            const interval = setInterval(() => {
                                this.scrollLeft = ++offset;

                                if (this.scrollLeft >= 10) {
                                    clearInterval(interval);
                                    spy.should.have.been.called.once;
                                    done();
                                }
                            }, 5);
                        });
            });

            it("onScrollStop should be called once ", (done) => {
                const spy = chai.spy();
                render(<Scrollbar style={ {width: 100, height: 100} } onScrollStop={ spy } scrollDetectionThreshold={ 50 } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            let offset = 0;
                            const interval = setInterval(() => {
                                this.scrollLeft = ++offset;

                                if (this.scrollLeft >= 10) {
                                    clearInterval(interval);

                                    setTimeout(() => {
                                        spy.should.have.been.called.once;
                                        done();
                                    }, 75);
                                }
                            }, 5);
                        });
            });
        });
    });
}
