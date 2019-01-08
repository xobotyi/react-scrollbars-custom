import expect from "expect";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Scrollbar from "react-scrollbars-custom";
import simulant from "simulant";
import sinon from "sinon";

export default function performTests() {
    describe("callbacks", () => {
        let node;
        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });
        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        it("should call onScrollStart when scrolling performed", done => {
            render(
                <Scrollbar
                    wrapperProps={{style: {width: 100, height: 100, position: "relative", padding: 0, margin: 0}}}>
                    <div style={{width: 200, height: 200, padding: 0, margin: 0}} />
                </Scrollbar>,
                node,
                function() {
                    let spy = sinon.spy(this, "scrollDetect");

                    simulant.fire(this.contentEl, "scroll");

                    expect(spy.callCount).toBe(1);
                    expect(spy.returnValues[0]).toBe(undefined);

                    done();
                }
            );
        });

        it("should call onScrollStart when scrolling performed", done => {
            let spy = sinon.spy();

            render(
                <Scrollbar
                    wrapperProps={{style: {width: 100, height: 100, position: "relative", padding: 0, margin: 0}}}
                    onScrollStart={spy}>
                    <div style={{width: 200, height: 200, padding: 0, margin: 0}} />
                </Scrollbar>,
                node,
                function() {
                    simulant.fire(this.contentEl, "scroll");

                    expect(spy.callCount).toBe(1);

                    done();
                }
            );
        });

        it("should call onScroll when scrolling performed", done => {
            let onScrollStart = sinon.spy(),
                onScroll = sinon.spy();

            render(
                <Scrollbar
                    wrapperProps={{style: {width: 100, height: 100, position: "relative", padding: 0, margin: 0}}}
                    onScrollStart={onScrollStart}
                    onScroll={onScroll}>
                    <div style={{width: 200, height: 200, padding: 0, margin: 0}} />
                </Scrollbar>,
                node,
                function() {
                    setTimeout(() => {
                        simulant.fire(this.contentEl, "scroll");
                        this.contentEl.scrollTop = 20;
                    }, 20);

                    setTimeout(() => {
                        expect(onScrollStart.callCount).toBe(1);
                        expect(onScroll.callCount).toBe(1);
                        expect(onScroll.calledAfter(onScrollStart)).toBeTruthy();

                        done();
                    }, 100);
                }
            );
        });

        it("should call onScrollStop when scrolling is done", done => {
            let onScrollStart = sinon.spy(),
                onScroll = sinon.spy(),
                onScrollStop = sinon.spy();

            render(
                <Scrollbar
                    wrapperProps={{style: {width: 100, height: 100, position: "relative", padding: 0, margin: 0}}}
                    onScrollStart={onScrollStart}
                    onScroll={onScroll}
                    onScrollStop={onScrollStop}>
                    <div style={{width: 200, height: 200, padding: 0, margin: 0}} />
                </Scrollbar>,
                node,
                function() {
                    setTimeout(() => {
                        simulant.fire(this.contentEl, "scroll");
                        this.contentEl.scrollTop = 20;
                    }, 20);

                    setTimeout(() => {
                        simulant.fire(this.contentEl, "scroll");
                        this.contentEl.scrollTop = 0;
                    }, 100);

                    setTimeout(() => {
                        simulant.fire(this.contentEl, "scroll");
                        this.contentEl.scrollTop = 70;
                    }, 120);

                    setTimeout(() => {
                        expect(onScrollStart.callCount).toBe(1);
                        expect(onScroll.callCount).toBe(3);
                        expect(onScrollStop.callCount).toBe(1);
                        expect(onScroll.calledAfter(onScrollStart)).toBeTruthy();
                        expect(onScrollStop.calledAfter(onScroll)).toBeTruthy();

                        done();
                    }, 250);
                }
            );
        });

        it("should call onScroll only when scroll changed via property", done => {
            let onScrollStart = sinon.spy(),
                onScroll = sinon.spy(),
                onScrollStop = sinon.spy();

            render(
                <Scrollbar
                    wrapperProps={{style: {width: 100, height: 100, position: "relative", padding: 0, margin: 0}}}
                    onScrollStart={onScrollStart}
                    onScroll={onScroll}
                    onScrollStop={onScrollStop}>
                    <div style={{width: 200, height: 200, padding: 0, margin: 0}} />
                </Scrollbar>,
                node,
                function() {
                    setTimeout(() => {
                        this.contentEl.scrollTop = 20;
                    }, 20);

                    setTimeout(() => {
                        expect(onScrollStart.callCount).toBe(1);
                        expect(onScroll.callCount).toBe(1);
                        expect(onScrollStop.callCount).toBe(1);
                        expect(onScroll.calledAfter(onScrollStart)).toBeTruthy();
                        expect(onScrollStop.calledAfter(onScroll)).toBeTruthy();

                        done();
                    }, 150);
                }
            );
        });
    });
}
