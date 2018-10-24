import expect from "expect";
import React from "react";
import sinon from "sinon";
import {
    createLoopController,
    LoopController,
} from "../src/util/LoopController";

describe("LoopController", () => {
    const ScrollbarMock = {
        update: () => {},
    };

    const spy = sinon.spy(ScrollbarMock, "update");

    it("should register the scrollbar", () => {
        LoopController.registerScrollbar(ScrollbarMock);
        expect(LoopController.getRegisteredScrollbars().length).toEqual(1);
        expect(LoopController.getRegisteredScrollbars()[0]).toEqual(
            ScrollbarMock,
        );
    });

    it("should call an 'update' method of registered scrollbar", done => {
        setTimeout(() => {
            expect(spy.callCount).toBeGreaterThanOrEqual(30);
            done();
        }, 500);
    });

    it("should stop the loop when .stop() executed", done => {
        let callCount = spy.callCount * 1;
        LoopController.stop();

        setTimeout(() => {
            expect(spy.callCount).toEqual(callCount);
            done();
        }, 500);
    });

    it("should start the loop when .start() executed", done => {
        let callCount = spy.callCount * 1;
        LoopController.start();

        setTimeout(() => {
            expect(spy.callCount).toBeGreaterThan(callCount);
            done();
        }, 500);
    });

    it("should unregister the scrollbar", () => {
        LoopController.unregisterScrollbar(ScrollbarMock);
        expect(LoopController.getRegisteredScrollbars().length).toEqual(0);
    });

    it("createLoopController should return new controller", () => {
        expect(createLoopController()).not.toEqual(LoopController);
    });
});
