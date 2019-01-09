import {render, unmountComponentAtNode} from "react-dom";
import * as  React from "react";
import Thumb from "../src/Thumb";
import simulant from "simulant";
import {DIRECTION_AXIS} from "../src/Scrollbar";

describe("Thumb", () => {
    let node: HTMLDivElement;
    beforeAll(() => {
        node = document.createElement('div');
        document.body.appendChild(node);
    });
    afterEach(() => {
        unmountComponentAtNode(node);
    });
    afterAll(() => {
        unmountComponentAtNode(node);
        document.body.removeChild(node);
    });

    it('should render thumb', (done) => {
        render(<Thumb axis={DIRECTION_AXIS.X} />, node, function () {
            done();
        });
    });

    it('should pass the element ref to element class property', (done) => {
        render(<Thumb axis={DIRECTION_AXIS.X} />, node, function () {
            expect(this.element instanceof HTMLElement).toBeTruthy();
            done();
        });
    });

    it('should pass the element ref to elementRef property', (done) => {
        let element: HTMLElement | null;
        render(<Thumb axis={DIRECTION_AXIS.X} elementRef={ref => element = ref} />, node, function () {
            expect(element instanceof HTMLElement).toBeTruthy();
            done();
        });
    });

    it('should render proper thumb with direction X axis', (done) => {
        render(<Thumb axis={DIRECTION_AXIS.X} />, node, function () {
            expect(this.props.axis).toBe(DIRECTION_AXIS.X);
            expect(this.element.classList.contains('thumbX')).toBeTruthy();
            done();
        });
    });

    it('should render proper thumb with direction Y axis', (done) => {
        render(<Thumb axis={DIRECTION_AXIS.Y} />, node, function () {
            expect(this.props.axis).toBe(DIRECTION_AXIS.Y);
            expect(this.element.classList.contains('thumbY')).toBeTruthy();
            done();
        });
    });

    it('should apply className', (done) => {
        render(<Thumb axis={DIRECTION_AXIS.Y} className="MyAwesomeClassName" />, node, function () {
            expect(this.element.classList.contains('MyAwesomeClassName')).toBeTruthy();
            done();
        });
    });

    it('should apply style', (done) => {
        render(<Thumb axis={DIRECTION_AXIS.Y} style={{width: 100, height: 200}} />, node, function () {
            expect(this.element.style.width).toBe('100px');
            expect(this.element.style.height).toBe('200px');
            done();
        });
    });

    it('should apply tagName', (done) => {
        render(<Thumb axis={DIRECTION_AXIS.Y} tagName="span" />, node, function () {
            expect(this.element.tagName).toBe("SPAN");
            done();
        });
    });

    it('should render if custom renderer passed', (done) => {
        let renderer = function (props) {
            return (
                <div className="customThumb">
                    <div ref={props.elementRef}>{props.children}</div>
                </div>
            );
        };

        render(<Thumb axis={DIRECTION_AXIS.Y} renderer={renderer} />, node, function () {
            expect(this.element.parentElement.classList.contains('customThumb')).toBeTruthy();

            done();
        });
    });

    it('should emit onDragStart on mousedown LMB', (done) => {
        let spy = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y} style={{width: 80, height: 100}} onDragStart={spy} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "mousedown", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            setTimeout(() => {
                expect(spy.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.Y);
                expect(spy.calls.argsFor(0)[0].offset).toBe(0);
                done();
            }, 5);
        });
    });

    it('should emit onDragStart on touchstart', (done) => {
        let spy = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y} style={{width: 80, height: 100}} onDragStart={spy} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "touchstart", {
                targetTouches: [new Touch({
                                              identifier: 123,
                                              target: this.element,
                                              pageX: left + width / 2,
                                              pageY: top + height / 2,
                                              screenX: left + width / 2,
                                              screenY: top + height / 2,
                                              clientX: left + width / 2,
                                              clientY: top + height / 2,
                                          })],
            });

            setTimeout(() => {
                expect(spy.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.Y);
                expect(spy.calls.argsFor(0)[0].offset).toBe(0);
                done();
            }, 5);
        });
    });
    it('should NOT emit onDragStart on touchstart if there is multiple touches', (done) => {
        let spy = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y} style={{width: 80, height: 100}} onDragStart={spy} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            let touches = [new Touch({
                                         identifier: 123,
                                         target: this.element,
                                         pageX: left + width / 2,
                                         pageY: top + height / 2,
                                         screenX: left + width / 2,
                                         screenY: top + height / 2,
                                         clientX: left + width / 2,
                                         clientY: top + height / 2,
                                     }),
                           new Touch({
                                         identifier: 321,
                                         target: this.element,
                                         pageX: left + width / 3,
                                         pageY: top + height / 3,
                                         screenX: left + width / 3,
                                         screenY: top + height / 3,
                                         clientX: left + width / 3,
                                         clientY: top + height / 3,
                                     }),
            ];

            simulant.fire(this.element, "touchstart", {
                touches: touches,
                targetTouches: touches,
            });

            setTimeout(() => {
                expect(spy).not.toHaveBeenCalled();
                done();
            }, 5);
        });
    });

    it('should NOT emit onDragStart on mousedown not LMB', (done) => {
        let spy = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y} style={{width: 80, height: 100}} onDragStart={spy} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "mousedown", {
                button: 1,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            setTimeout(() => {
                expect(spy).not.toHaveBeenCalled();
                done();
            }, 5);
        });
    });

    it('should emit onDragEnd on touchend', (done) => {
        let start = jasmine.createSpy();
        let end   = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}}
                      onDragStart={start}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            let touches = [new Touch({
                                         identifier: 123,
                                         target: this.element,
                                         pageX: left + width / 2,
                                         pageY: top + height / 2,
                                         screenX: left + width / 2,
                                         screenY: top + height / 2,
                                         clientX: left + width / 2,
                                         clientY: top + height / 2,
                                     })];

            simulant.fire(this.element, "touchstart", {
                touches: touches,
                targetTouches: touches,
            });
            simulant.fire(this.element, "touchend", {
                touches: touches,
                targetTouches: touches,
                changedTouches: touches,
            });

            setTimeout(() => {
                expect(start).toHaveBeenCalled();
                expect(end).toHaveBeenCalled();

                expect(end.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.Y);
                expect(end.calls.argsFor(0)[0].offset).toBe(0);
                expect(start).toHaveBeenCalledBefore(end);
                done();
            }, 5);
        });
    });

    it('should use changedTouches or targetTouches in onDragEnd and onDrag', (done) => {
        let start = jasmine.createSpy();
        let end   = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}}
                      onDragStart={start}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            let touches = [new Touch({
                                         identifier: 123,
                                         target: this.element,
                                         pageX: left + width / 2,
                                         pageY: top + height / 2,
                                         screenX: left + width / 2,
                                         screenY: top + height / 2,
                                         clientX: left + width / 2,
                                         clientY: top + height / 2,
                                     })];

            simulant.fire(this.element, "touchstart", {
                touches: touches,
                targetTouches: touches,
            });
            simulant.fire(this.element, "touchmove", {
                touches: touches,
                changedTouches: touches,
            });
            simulant.fire(this.element, "touchend", {
                touches: touches,
                changedTouches: touches,
            });
            simulant.fire(this.element, "touchstart", {
                touches: touches,
                targetTouches: touches,
            });
            simulant.fire(this.element, "touchmove", {
                touches: touches,
                targetTouches: touches,
            });
            simulant.fire(this.element, "touchend", {
                touches: touches,
                targetTouches: touches,
            });

            setTimeout(() => {
                expect(start).toHaveBeenCalled();
                expect(end).toHaveBeenCalled();
                done();
            }, 5);
        });
    });

    it('should emit onDragEnd on mouseup', (done) => {
        let start = jasmine.createSpy();
        let end   = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}}
                      onDragStart={start}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "mousedown", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });
            simulant.fire(this.element, "mouseup", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            setTimeout(() => {
                expect(start).toHaveBeenCalled();
                expect(end).toHaveBeenCalled();

                expect(end.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.Y);
                expect(end.calls.argsFor(0)[0].offset).toBe(0);
                expect(start).toHaveBeenCalledBefore(end);
                done();
            }, 5);
        });
    });

    it('should emit onDrag on mousemove', (done) => {
        let start = jasmine.createSpy();
        let end   = jasmine.createSpy();
        let drag  = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}}
                      onDragStart={start}
                      onDrag={drag}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "mousedown", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });
            simulant.fire(this.element, "mousemove", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });
            simulant.fire(this.element, "mouseup", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            setTimeout(() => {
                expect(drag).toHaveBeenCalled();
                expect(start).toHaveBeenCalled();
                expect(end).toHaveBeenCalled();

                expect(drag.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.Y);
                expect(drag.calls.argsFor(0)[0].offset).toBe(0);
                expect(start).toHaveBeenCalledBefore(drag);
                expect(drag).toHaveBeenCalledBefore(end);
                done();
            }, 5);
        });
    });

    it('should emit onDrag on touchmove', (done) => {
        let start = jasmine.createSpy();
        let end   = jasmine.createSpy();
        let drag  = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}}
                      onDragStart={start}
                      onDrag={drag}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            let touches = [new Touch({
                                         identifier: 123,
                                         target: this.element,
                                         pageX: left + width / 2,
                                         pageY: top + height / 2,
                                         screenX: left + width / 2,
                                         screenY: top + height / 2,
                                         clientX: left + width / 2,
                                         clientY: top + height / 2,
                                     })];

            simulant.fire(this.element, "touchstart", {
                touches: touches,
                targetTouches: touches,
            });
            simulant.fire(this.element, "touchmove", {
                touches: touches,
                targetTouches: touches,
            });
            simulant.fire(this.element, "touchend", {
                touches: touches,
                targetTouches: touches,
                changedTouches: touches,
            });

            setTimeout(() => {
                expect(drag).toHaveBeenCalled();
                expect(start).toHaveBeenCalled();
                expect(end).toHaveBeenCalled();

                expect(drag.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.Y);
                expect(drag.calls.argsFor(0)[0].offset).toBe(0);
                expect(start).toHaveBeenCalledBefore(drag);
                expect(drag).toHaveBeenCalledBefore(end);
                done();
            }, 5);
        });
    });

    it('should end the dragging if element was removed', (done) => {
        let start = jasmine.createSpy();
        let end   = jasmine.createSpy();
        let drag  = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}}
                      onDragStart={start}
                      onDrag={drag}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "mousedown", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            this.element = null;
            this.handleDrag(new MouseEvent('mousemove', {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            }));

            setTimeout(() => {
                expect(drag).not.toHaveBeenCalled();
                expect(start).toHaveBeenCalled();
                expect(end).toHaveBeenCalled();

                expect(start).toHaveBeenCalledBefore(end);
                done();
            }, 5);
        });
    });

    it('onDragEnd should return proper axis value (X)', (done) => {
        let start = jasmine.createSpy();
        let end   = jasmine.createSpy();
        let drag  = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.X}
                      style={{width: 80, height: 100}}
                      onDragStart={start}
                      onDrag={drag}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "mousedown", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });
            simulant.fire(this.element, "mousemove", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });
            simulant.fire(this.element, "mouseup", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            setTimeout(() => {
                expect(start.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.X);
                expect(drag.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.X);
                expect(end.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.X);
                done();
            }, 5);
        });
    });

    it('onDragEnd should return proper axis value (Y)', (done) => {
        let start = jasmine.createSpy();
        let end   = jasmine.createSpy();
        let drag  = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}}
                      onDragStart={start}
                      onDrag={drag}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "mousedown", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });
            simulant.fire(this.element, "mousemove", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });
            simulant.fire(this.element, "mouseup", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            setTimeout(() => {
                expect(start.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.Y);
                expect(drag.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.Y);
                expect(end.calls.argsFor(0)[0].axis).toBe(DIRECTION_AXIS.Y);
                done();
            }, 5);
        });
    });

    it('handleDragStart while removed element shall emit onDragEnd', (done) => {
        let start = jasmine.createSpy();
        let end   = jasmine.createSpy();
        let drag  = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}}
                      onDragStart={start}
                      onDrag={drag}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            this.element = null;
            this.handleDragStart(new MouseEvent('mousemove', {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            }));

            setTimeout(() => {
                expect(drag).not.toHaveBeenCalled();
                expect(start).not.toHaveBeenCalled();
                expect(end).toHaveBeenCalled();
                done();
            }, 5);
        });
    });

    it('while dragging element should have the `dragging` classname', (done) => {
        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            this.handleDragStart(new MouseEvent('mousemove', {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            }));

            setTimeout(() => {
                expect(this.element.classList.contains('dragging')).toBeTruthy();
                done();
            }, 5);
        });
    });

    it('should end the dragging when component is unmounted', (done) => {
        let end = jasmine.createSpy();

        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}}
                      onDragEnd={end} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            this.handleDragStart(new MouseEvent('mousemove', {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            }));

            setTimeout(() => {
                unmountComponentAtNode(node);
                expect(end).toHaveBeenCalled();

                done();
            }, 5);
        });
    });

    it('should set document`s user-select to none and replace onselectstart callback', (done) => {
        render(<Thumb axis={DIRECTION_AXIS.Y}
                      style={{width: 80, height: 100}} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            this.handleDragStart(new MouseEvent('mousemove', {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            }));

            setTimeout(() => {
                expect(document.body.style.userSelect).toBe("none");
                // @ts-ignore
                expect(document.onselectstart()).toBe(false);

                done();
            }, 5);
        });
    });
});
