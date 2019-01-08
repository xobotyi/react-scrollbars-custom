import {render, unmountComponentAtNode} from "react-dom";
import * as  React from "react";
import Track from "../src/Track";
import simulant from "simulant";
import {DIRECTION_AXIS} from "../src/Scrollbar";

describe("Track", () => {
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

    it('should render track', (done) => {
        render(<Track axis={DIRECTION_AXIS.X} />, node, function () {
            done();
        });
    });

    it('should pass the element ref to element class property', (done) => {
        render(<Track axis={DIRECTION_AXIS.X} />, node, function () {
            expect(this.element instanceof HTMLElement).toBeTruthy();
            done();
        });
    });

    it('should pass the element ref to elementRef property', (done) => {
        let element: HTMLElement | null;
        render(<Track axis={DIRECTION_AXIS.X} elementRef={ref => element = ref} />, node, function () {
            expect(element instanceof HTMLElement).toBeTruthy();
            done();
        });
    });

    it('should render proper track with direction X axis', (done) => {
        render(<Track axis={DIRECTION_AXIS.X} />, node, function () {
            expect(this.props.axis).toBe(DIRECTION_AXIS.X);
            expect(this.element.classList.contains('trackX')).toBeTruthy();
            done();
        });
    });

    it('should render proper track with direction Y axis', (done) => {
        render(<Track axis={DIRECTION_AXIS.Y} />, node, function () {
            expect(this.props.axis).toBe(DIRECTION_AXIS.Y);
            expect(this.element.classList.contains('trackY')).toBeTruthy();
            done();
        });
    });

    it('should apply className', (done) => {
        render(<Track axis={DIRECTION_AXIS.Y} className="MyAwesomeClassName" />, node, function () {
            expect(this.element.classList.contains('MyAwesomeClassName')).toBeTruthy();
            done();
        });
    });

    it('should apply style', (done) => {
        render(<Track axis={DIRECTION_AXIS.Y} style={{width: 100, height: 200}} />, node, function () {
            expect(this.element.style.width).toBe('100px');
            expect(this.element.style.height).toBe('200px');
            done();
        });
    });

    it('should apply tagName', (done) => {
        render(<Track axis={DIRECTION_AXIS.Y} tagName="span" />, node, function () {
            expect(this.element.tagName).toBe("SPAN");
            done();
        });
    });

    it('should handle click event', (done) => {
        let spy = jasmine.createSpy();
        render(<Track axis={DIRECTION_AXIS.Y} style={{width: 100, height: 200}} onClick={spy} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "click", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            expect(spy).toHaveBeenCalled();

            done();
        });
    });

    it('should call onClick with proper parameters for X axis', (done) => {
        let spy = jasmine.createSpy();
        render(<Track axis={DIRECTION_AXIS.X} style={{width: 100, height: 200}} onClick={spy} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "click", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            expect(spy.calls.argsFor(0)[0] instanceof MouseEvent).toBeTruthy();
            expect(spy.calls.argsFor(0)[1].axis).toBe(DIRECTION_AXIS.X);
            expect(spy.calls.argsFor(0)[1].offset).toBe(50);

            done();
        });
    });

    it('should call onClick with proper parameters for Y axis', (done) => {
        let spy = jasmine.createSpy();
        render(<Track axis={DIRECTION_AXIS.Y} style={{width: 100, height: 200}} onClick={spy} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "click", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            expect(spy.calls.argsFor(0)[0] instanceof MouseEvent).toBeTruthy();
            expect(spy.calls.argsFor(0)[1].axis).toBe(DIRECTION_AXIS.Y);
            expect(spy.calls.argsFor(0)[1].offset).toBe(100);

            done();
        });
    });

    it('should not call onClick callback if element was deleted/unmounted or clicked not LMB', (done) => {
        let spy = jasmine.createSpy();
        render(<Track axis={DIRECTION_AXIS.Y} style={{width: 100, height: 200}} onClick={spy} />, node, function () {
            simulant.fire(this.element, "click", {
                button: 1,
            });

            expect(spy).not.toHaveBeenCalled();

            this.handleClick(new MouseEvent('click'));

            expect(spy).not.toHaveBeenCalled();

            done();
        });
    });

    it('should render if custom renderer passed', (done) => {
        let renderer = function (props) {
            return (
                <div className="customTrack">
                    <div ref={props.elementRef}>{props.children}</div>
                </div>
            );
        };

        render(<Track axis={DIRECTION_AXIS.Y} renderer={renderer} />, node, function () {
            expect(this.element.parentElement.classList.contains('customTrack')).toBeTruthy();

            done();
        });
    });


    // Unable to cover this one due to weird React behavior.
    // ToDo: monitor the issue: https://github.com/facebook/react/issues/14549
    // it('should throw if element ref was not passed', (done) => {
    //     let renderer = function (props) {
    //         return (
    //             <div className="customTrack">{props.children}</div>
    //         );
    //     };
    //
    //     class ErrorBoundary extends React.Component<{}, { [key: string]: any }> {
    //         constructor(props) {
    //             super(props);
    //             this.state = {error: null, errorInfo: null};
    //         }
    //
    //         componentDidCatch(error, errorInfo) {
    //             this.setState({
    //                               error: error,
    //                               errorInfo: errorInfo,
    //                           });
    //         }
    //
    //         render() {
    //             if (this.state.errorInfo) {
    //                 return false;
    //             }
    //
    //             return this.props.children;
    //         }
    //     }
    //
    //     try {
    //         render(<ErrorBoundary>
    //             <Track axis={DIRECTION_AXIS.Y} renderer={renderer} />
    //         </ErrorBoundary>, node, function () {
    //             setTimeout(() => {
    //                 console.log(this.state.error);
    //
    //                 expect(this.state.error instanceof Error).toBeTruthy();
    //                 expect(this.state.error.message).toBe('Somewhy element was not created.');
    //
    //                 done();
    //             }, 10);
    //         });
    //     } catch (e) {}
    // });

    it('*just for branches coverage*', (done) => {
        render(<Track axis={DIRECTION_AXIS.X} style={{width: 100, height: 200}} />, node, function () {
            const {top, height, left, width} = this.element.getBoundingClientRect();

            simulant.fire(this.element, "click", {
                button: 0,
                clientY: top + height / 2,
                clientX: left + width / 2,
            });

            done();
        });
    });
});
