import {UpdateLoop} from "../src/UpdateLoop";
import Scrollbar from "../src";

describe("UpdateLoop", () => {
    let loop = new UpdateLoop();
    // @ts-ignore
    loop.dbgGetTargets = function() {
        return this.targets;
    }.bind(loop);
    let scrollbar = new Scrollbar({});

    let spy: jasmine.Spy;

    beforeEach(() => {
        loop.removeScrollbar(scrollbar);
        loop.stop();
        spy = spyOn(scrollbar, "update");
    });

    describe("isActive()", () => {
        it("should return boolean", () => {
            expect(typeof loop.isActive).toBe("boolean");
        });

        it("should return actual loop state", () => {
            expect(loop.isActive).toBe(false);
        });
    });

    describe("start()", () => {
        it("should return instance", () => {
            expect(loop.start()).toBe(loop);
        });

        it("should NOT start the loop if no scrollbars to iterate", () => {
            loop.start();
            expect(loop.isActive).toBeFalsy();
        });

        it("should start the loop if has scrollbars to iterate", done => {
            loop.addScrollbar(scrollbar);
            loop.stop();
            loop.start();
            expect(spy).not.toHaveBeenCalled();

            setTimeout(() => {
                expect(spy).toHaveBeenCalled();
                done();
            }, 20);
        });

        it("should cancel previous frame *for branches coverage*", () => {
            // @ts-ignore
            loop.dbgGetTargets().push(scrollbar);
            // @ts-ignore
            loop.animationFrameID = 1;

            loop.start();
            expect(loop.isActive).toBeTruthy();
        });
    });

    describe("stop()", () => {
        it("should return instance", () => {
            expect(loop.stop()).toBe(loop);
        });

        it("should stop the loop if has scrollbars to iterate", done => {
            loop.addScrollbar(scrollbar);
            expect(spy).not.toHaveBeenCalled();

            setTimeout(() => {
                expect(spy).toHaveBeenCalled();
                let recentCalls = spy.calls.count();

                loop.stop();

                setTimeout(() => {
                    expect(spy.calls.count()).toBe(recentCalls);
                    done();
                }, 20);
            }, 20);
        });
    });

    describe("addScrollbar()", () => {
        it("should return instance", () => {
            expect(loop.addScrollbar(scrollbar)).toBe(loop);

            // for branches coverage
            loop.addScrollbar(scrollbar);
        });

        it("should add scrollbar to the targets", () => {
            // @ts-ignore
            expect(loop.dbgGetTargets().length).toBe(0);
            loop.addScrollbar(scrollbar);
            // @ts-ignore
            expect(loop.dbgGetTargets().length).toBe(1);
        });
    });

    describe("removeScrollbar()", () => {
        it("should return instance", () => {
            expect(loop.removeScrollbar(scrollbar)).toBe(loop);
        });

        it("should remove scrollbar from the targets", () => {
            loop.addScrollbar(scrollbar);
            // @ts-ignore
            expect(loop.dbgGetTargets().length).toBe(1);
            loop.removeScrollbar(scrollbar);
            // @ts-ignore
            expect(loop.dbgGetTargets().length).toBe(0);
        });
    });

    describe("frameRequestCallback()", () => {
        it("should do nothing if loop is inactive", () => {
            expect(spy).not.toHaveBeenCalled();
            // @ts-ignore
            loop.frameRequestCallback();
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
