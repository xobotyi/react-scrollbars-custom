import expect                             from "expect";
import React                              from "react";
import { render, unmountComponentAtNode } from "react-dom";
import Scrollbar                          from "react-scrollbars-custom";
import simulant                           from "simulant";
import sinon                              from "sinon";

export default function performTests() {
    describe("scroll triggers", () => {
        let node;

        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });

        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        describe("onScroll", function () {
            const onScroll = sinon.spy();

            it("should should be called once after the scroll", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } onScroll={ onScroll }>
                            <div style={ {width: 200, height: 200} } />
                        </Scrollbar>,
                        node,
                        function () {
                            const {trackVertical} = this;
                            const {top, height} = trackVertical.getBoundingClientRect();

                            simulant.fire(trackVertical, 'mousedown', {
                                which:   1,
                                target:  trackVertical,
                                clientY: top + height / 2,
                            });

                            setTimeout(() => {
                                expect(onScroll.callCount).toEqual(1);

                                done();
                            }, 50);
                        });
            });
        });

        describe("onScrollStart", function () {
            const onScrollStart = sinon.spy();
            const onScrollStop = sinon.spy();

            it("should should be called once before the onScrollStop", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} }
                                  onScrollStart={ onScrollStart } onScrollStop={ onScrollStop } scrollDetectionThreshold={ 50 }>
                            <div style={ {width: 200, height: 200} } />
                        </Scrollbar>,
                        node,
                        function () {
                            const {trackVertical} = this;
                            const {top, height} = trackVertical.getBoundingClientRect();

                            simulant.fire(trackVertical, 'mousedown', {
                                which:   1,
                                target:  trackVertical,
                                clientY: top + height / 2,
                            });

                            setTimeout(() => {
                                expect(onScrollStart.callCount).toEqual(1);
                                expect(onScrollStop.callCount).toEqual(0);

                                simulant.fire(trackVertical, 'mousedown', {
                                    which:   1,
                                    target:  trackVertical,
                                    clientY: top + 3,
                                });

                                setTimeout(() => {
                                    expect(onScrollStart.callCount).toBe(1);
                                    expect(onScrollStop.callCount).toEqual(0);

                                    simulant.fire(trackVertical, 'mousedown', {
                                        which:   1,
                                        target:  trackVertical,
                                        clientY: top + 30,
                                    });

                                    setTimeout(() => {
                                        expect(onScrollStart.callCount).toEqual(1);
                                        expect(onScrollStop.callCount).toEqual(1);
                                        expect(onScrollStart.calledBefore(onScrollStop)).toBeTruthy();

                                        done();
                                    }, 70);
                                }, 30);
                            }, 30);
                        });
            });
        });

        describe("onScrollStop", function () {
            const onScrollStop = sinon.spy();

            it("should not be triggered while thumb dragging is processed", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} }
                                  onScrollStop={ onScrollStop } scrollDetectionThreshold={ 50 }>
                            <div style={ {width: 200, height: 200} } />
                        </Scrollbar>,
                        node,
                        function () {
                            const {trackVertical} = this;
                            const {top, height} = trackVertical.getBoundingClientRect();

                            simulant.fire(trackVertical, 'mousedown', {
                                which:   1,
                                target:  trackVertical,
                                clientY: top + height / 2,
                            });

                            this.drag = true;

                            setTimeout(() => {
                                expect(onScrollStop.callCount).toEqual(0);

                                setTimeout(() => {
                                    expect(onScrollStop.callCount).toEqual(0);
                                    this.drag = false;

                                    setTimeout(() => {
                                        expect(onScrollStop.callCount).toEqual(1);

                                        done();
                                    }, 70);
                                }, 30);
                            }, 30);
                        });
            });
        });
    });
}
