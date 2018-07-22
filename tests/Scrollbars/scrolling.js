import expect                             from "expect";
import React                              from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Scrollbar }                      from "react-scrollbars-custom";
import sinon                              from "sinon";

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
            it("should not trigger a rerender", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            const updateSpy = sinon.spy(Scrollbar.prototype, 'update');
                            const renderSpy = sinon.spy(Scrollbar.prototype, 'render');

                            this.scrollTop = 50;

                            expect(updateSpy.callCount).toBe(1);
                            expect(renderSpy.callCount).toBe(0);

                            updateSpy.restore();
                            renderSpy.restore();
                            done();
                        });
            });

            it("onScroll should be called", (done) => {
                const spy = sinon.spy();
                render(<Scrollbar style={ {width: 100, height: 100} } onScroll={ spy } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            this.scrollTop = 50;
                            setTimeout(() => {
                                expect(spy.callCount).toBe(1);
                                expect(spy.getCall(0).args[0]).toMatchObject({
                                                                                 left:         0,
                                                                                 top:          0.5,
                                                                                 scrollLeft:   0,
                                                                                 scrollTop:    50,
                                                                                 scrollHeight: 200,
                                                                                 scrollWidth:  200,
                                                                                 clientWidth:  100,
                                                                                 clientHeight: 100,
                                                                             });
                                done();
                            }, 50);
                        });
            });

            it("onScrollStart should be called once", (done) => {
                const spy = sinon.spy();
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
                                    expect(spy.callCount).toBe(1);
                                    done();
                                }
                            }, 5);
                        });
            });

            it("onScrollStop should be called once ", (done) => {
                const spy = sinon.spy();
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
                                        expect(spy.callCount).toBe(1);
                                        done();
                                    }, 75);
                                }
                            }, 5);
                        });
            });
        });

        describe("when scrolling horizontally", function () {
            it("should not trigger a rerender", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            const updateSpy = sinon.spy(Scrollbar.prototype, 'update');
                            const renderSpy = sinon.spy(Scrollbar.prototype, 'render');

                            this.scrollTop = 50;

                            expect(updateSpy.callCount).toBe(1);
                            expect(renderSpy.callCount).toBe(0);

                            updateSpy.restore();
                            renderSpy.restore();
                            done();
                        });
            });

            it("onScroll should be called", (done) => {
                const spy = sinon.spy();
                render(<Scrollbar style={ {width: 100, height: 100} } onScroll={ spy } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            this.scrollLeft = 50;
                            setTimeout(() => {
                                expect(spy.callCount).toBe(1);
                                expect(spy.getCall(0).args[0]).toMatchObject({
                                                                                 top:          0,
                                                                                 left:         0.5,
                                                                                 scrollTop:    0,
                                                                                 scrollLeft:   50,
                                                                                 scrollHeight: 200,
                                                                                 scrollWidth:  200,
                                                                                 clientWidth:  100,
                                                                                 clientHeight: 100,
                                                                             });
                                done();
                            }, 50);
                        });
            });

            it("onScrollStart should be called once", (done) => {
                const spy = sinon.spy();
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
                                    expect(spy.callCount).toBe(1);
                                    done();
                                }
                            }, 5);
                        });
            });

            it("onScrollStop should be called once ", (done) => {
                const spy = sinon.spy();
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
                                        expect(spy.callCount).toBe(1);
                                        done();
                                    }, 75);
                                }
                            }, 5);
                        });
            });
        });
    });
}
