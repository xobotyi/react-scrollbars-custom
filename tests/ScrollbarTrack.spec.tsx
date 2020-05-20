import ScrollbarTrack from "../src/ScrollbarTrack";
import * as ReactDOM from "react-dom";
import * as React from "react";
import * as simulant from "simulant";
import { AXIS_DIRECTION } from "../src/types";

describe("ScrollbarTrack", () => {
  let node: HTMLDivElement;
  beforeAll(() => {
    node = document.createElement("div");
    document.body.appendChild(node);
  });
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });
  afterAll(() => {
    ReactDOM.unmountComponentAtNode(node);
    document.body.removeChild(node);
  });

  it("should render a div by default", (done) => {
    ReactDOM.render(<ScrollbarTrack axis={AXIS_DIRECTION.X} />, node, function () {
      expect(this.element instanceof HTMLDivElement).toBeTruthy();
      done();
    });
  });

  it("should pass rendered element ref to elementRef function", (done) => {
    let element: HTMLDivElement | null;
    ReactDOM.render(
      <ScrollbarTrack axis={AXIS_DIRECTION.X} elementRef={(ref) => (element = ref)} />,
      node,
      function () {
        expect(element instanceof HTMLDivElement).toBeTruthy();
        done();
      }
    );
  });

  it("should render proper track with direction X axis", (done) => {
    ReactDOM.render(<ScrollbarTrack axis={AXIS_DIRECTION.X} />, node, function () {
      expect(this.props.axis).toBe(AXIS_DIRECTION.X);
      expect(this.element.classList.contains("ScrollbarsCustom-TrackX")).toBeTruthy();
      done();
    });
  });

  it("should render proper track with direction Y axis", (done) => {
    ReactDOM.render(<ScrollbarTrack axis={AXIS_DIRECTION.Y} />, node, function () {
      expect(this.props.axis).toBe(AXIS_DIRECTION.Y);
      expect(this.element.classList.contains("ScrollbarsCustom-TrackY")).toBeTruthy();
      done();
    });
  });

  it("should apply className", (done) => {
    ReactDOM.render(<ScrollbarTrack axis={AXIS_DIRECTION.Y} className="MyAwesomeClassName" />, node, function () {
      expect(this.element.classList.contains("MyAwesomeClassName")).toBeTruthy();
      done();
    });
  });

  it("should apply style", (done) => {
    ReactDOM.render(<ScrollbarTrack axis={AXIS_DIRECTION.Y} style={{ width: 100, height: 200 }} />, node, function () {
      expect(this.element.style.width).toBe("100px");
      expect(this.element.style.height).toBe("200px");
      done();
    });
  });

  it("should render if custom renderer passed", (done) => {
    let renderer = function (props) {
      return (
        <div className="customTrack">
          <div ref={props.elementRef}>{props.children}</div>
        </div>
      );
    };

    ReactDOM.render(<ScrollbarTrack axis={AXIS_DIRECTION.Y} renderer={renderer} />, node, function () {
      expect(this.element.parentElement.classList.contains("customTrack")).toBeTruthy();

      done();
    });
  });

  it("should throw if renderer did not passed the element link", (done) => {
    let renderer = function (props) {
      return (
        <div className="customTrack">
          <div>{props.children}</div>
        </div>
      );
    };

    class ErrorBoundary extends React.Component<{}, { [key: string]: any }> {
      constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
      }

      componentDidCatch(error, errorInfo) {
        this.setState({
          error: error,
          errorInfo: errorInfo,
        });
      }

      render() {
        if (this.state.errorInfo) {
          return false;
        }

        return this.props.children;
      }
    }

    ReactDOM.render(
      <ErrorBoundary>
        <ScrollbarTrack axis={AXIS_DIRECTION.Y} renderer={renderer} />
      </ErrorBoundary>,
      node,
      function () {
        setTimeout(() => {
          console.log(this.state.error);

          expect(this.state.error instanceof Error).toBeTruthy();
          expect(this.state.error.message).toBe(
            "Element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
          );

          done();
        }, 10);
      }
    );
  });

  it("should handle click event", (done) => {
    let spy = jasmine.createSpy();
    ReactDOM.render(
      <ScrollbarTrack axis={AXIS_DIRECTION.Y} style={{ width: 100, height: 200 }} onClick={spy} />,
      node,
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, "click", {
          button: 0,
          offsetY: top + height / 2,
          offsetX: left + width / 2,
        });

        expect(spy).toHaveBeenCalled();

        done();
      }
    );
  });

  it("should call onClick with proper parameters for X axis", (done) => {
    let spy = jasmine.createSpy();
    ReactDOM.render(
      <ScrollbarTrack axis={AXIS_DIRECTION.X} style={{ width: 100, height: 200 }} onClick={spy} />,
      node,
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, "click", {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        expect(spy.calls.argsFor(0)[0] instanceof MouseEvent).toBeTruthy();
        expect(spy.calls.argsFor(0)[1].axis).toBe(AXIS_DIRECTION.X);
        expect(spy.calls.argsFor(0)[1].offset).toBe(50);

        done();
      }
    );
  });

  it("should call onClick with proper parameters for Y axis", (done) => {
    let spy = jasmine.createSpy();
    ReactDOM.render(
      <ScrollbarTrack axis={AXIS_DIRECTION.Y} style={{ width: 100, height: 200 }} onClick={spy} />,
      node,
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, "click", {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        expect(spy.calls.argsFor(0)[0] instanceof MouseEvent).toBeTruthy();
        expect(spy.calls.argsFor(0)[1].axis).toBe(AXIS_DIRECTION.Y);
        expect(spy.calls.argsFor(0)[1].offset).toBe(100);

        done();
      }
    );
  });

  it("should not call onClick callback if element was deleted/unmounted or clicked not LMB", (done) => {
    let spy = jasmine.createSpy();
    ReactDOM.render(
      <ScrollbarTrack axis={AXIS_DIRECTION.Y} style={{ width: 100, height: 200 }} onClick={spy} />,
      node,
      function () {
        simulant.fire(this.element, "click", {
          button: 1,
        });

        expect(spy).not.toHaveBeenCalled();

        this.handleClick(new MouseEvent("click"));

        expect(spy).not.toHaveBeenCalled();

        done();
      }
    );
  });
});
