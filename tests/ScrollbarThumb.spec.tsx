import { PropsWithChildren } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as simulant from 'simulant';
import ScrollbarThumb from '../src/ScrollbarThumb';
import { AXIS_DIRECTION } from '../src/types';

describe('ScrollbarThumb', () => {
  const nodes: HTMLDivElement[] = [];

  const getNode = () => {
    const node = document.createElement('div');
    document.body.append(node);
    nodes.push(node);

    return node;
  };

  afterAll(() => {
    nodes.forEach((node) => node.remove());
  });

  it('should render a div by default', (done) => {
    ReactDOM.render(<ScrollbarThumb axis={AXIS_DIRECTION.X} />, getNode(), function () {
      expect(this.element instanceof HTMLDivElement).toBeTruthy();
      done();
    });
  });

  it('should pass rendered element ref to elementRef function', (done) => {
    let element: HTMLDivElement | null;
    ReactDOM.render(
      <ScrollbarThumb
        axis={AXIS_DIRECTION.X}
        elementRef={(ref) => {
          element = ref;
        }}
      />,
      getNode(),
      function () {
        expect(element instanceof HTMLElement).toBe(true);
        done();
      }
    );
  });

  it('should render proper track with direction X axis', (done) => {
    ReactDOM.render(<ScrollbarThumb axis={AXIS_DIRECTION.X} />, getNode(), function () {
      expect(this.props.axis).toBe(AXIS_DIRECTION.X);
      expect(this.element.classList.contains('ScrollbarsCustom-ThumbX')).toBeTruthy();
      done();
    });
  });

  it('should render proper track with direction Y axis', (done) => {
    ReactDOM.render(<ScrollbarThumb axis={AXIS_DIRECTION.Y} />, getNode(), function () {
      expect(this.props.axis).toBe(AXIS_DIRECTION.Y);
      expect(this.element.classList.contains('ScrollbarsCustom-ThumbY')).toBeTruthy();
      done();
    });
  });

  it('should apply className', (done) => {
    ReactDOM.render(
      <ScrollbarThumb axis={AXIS_DIRECTION.Y} className="MyAwesomeClassName" />,
      getNode(),
      function () {
        expect(this.element.classList.contains('MyAwesomeClassName')).toBeTruthy();
        done();
      }
    );
  });

  it('should apply style', (done) => {
    ReactDOM.render(
      <ScrollbarThumb axis={AXIS_DIRECTION.Y} style={{ width: 100, height: 200 }} />,
      getNode(),
      function () {
        expect(this.element.style.width).toBe('100px');
        expect(this.element.style.height).toBe('200px');
        done();
      }
    );
  });

  it('should render if custom renderer passed', (done) => {
    const renderer = function (props) {
      return (
        <div className="customTrack">
          <div ref={props.elementRef}>{props.children}</div>
        </div>
      );
    };

    ReactDOM.render(
      <ScrollbarThumb axis={AXIS_DIRECTION.Y} renderer={renderer} />,
      getNode(),
      function () {
        expect(this.element.parentElement.classList.contains('customTrack')).toBeTruthy();

        done();
      }
    );
  });

  it('should throw if renderer did not passed the element link', (done) => {
    const renderer = function (props) {
      return (
        <div className="customTrack">
          <div>{props.children}</div>
        </div>
      );
    };

    class ErrorBoundary extends React.Component<PropsWithChildren, { [key: string]: any }> {
      constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
      }

      componentDidCatch(error, errorInfo) {
        this.setState({
          error,
          errorInfo,
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
        <ScrollbarThumb axis={AXIS_DIRECTION.Y} renderer={renderer} />
      </ErrorBoundary>,
      getNode(),
      function () {
        setTimeout(() => {
          expect(this.state.error instanceof Error).toBeTruthy();
          expect(this.state.error.message).toBe(
            "<ScrollbarThumb> Element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
          );

          done();
        }, 10);
      }
    );
  });

  it('should emit onDragStart on mousedown LMB', (done) => {
    const spy = jasmine.createSpy();

    ReactDOM.render(
      <ScrollbarThumb
        axis={AXIS_DIRECTION.Y}
        style={{ width: 80, height: 100 }}
        onDragStart={spy}
      />,
      getNode(),
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, 'mousedown', {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        setTimeout(() => {
          expect(spy.calls.argsFor(0)[0].y).toBe(top);
          expect(spy.calls.argsFor(0)[0].x).toBe(left);
          done();
        }, 5);
      }
    );
  });

  it('should NOT emit onDragStart on mousedown not LMB', (done) => {
    const spy = jasmine.createSpy();

    ReactDOM.render(
      <ScrollbarThumb
        axis={AXIS_DIRECTION.Y}
        style={{ width: 80, height: 100 }}
        onDragStart={spy}
      />,
      getNode(),
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, 'mousedown', {
          button: 1,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        setTimeout(() => {
          expect(spy).not.toHaveBeenCalled();
          done();
        }, 5);
      }
    );
  });

  it('should emit onDragEnd on mouseup', (done) => {
    const start = jasmine.createSpy();
    const end = jasmine.createSpy();

    ReactDOM.render(
      <ScrollbarThumb
        axis={AXIS_DIRECTION.Y}
        style={{ width: 80, height: 100 }}
        onDragStart={start}
        onDragEnd={end}
      />,
      getNode(),
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, 'mousedown', {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });
        setTimeout(() => {
          simulant.fire(document, 'mouseup', {
            button: 0,
            clientY: top + height / 2,
            clientX: left + width / 2,
          });

          setTimeout(() => {
            expect(start).toHaveBeenCalled();
            expect(end).toHaveBeenCalled();
            expect(start).toHaveBeenCalledBefore(end);

            expect(end.calls.argsFor(0)[0].y).toBe(top);
            expect(end.calls.argsFor(0)[0].x).toBe(left);
            done();
          }, 5);
        }, 5);
      }
    );
  });

  it('should emit onDrag on mousemove', (done) => {
    const start = jasmine.createSpy();
    const end = jasmine.createSpy();
    const drag = jasmine.createSpy();

    ReactDOM.render(
      <ScrollbarThumb
        axis={AXIS_DIRECTION.Y}
        style={{ width: 80, height: 100 }}
        onDragStart={start}
        onDrag={drag}
        onDragEnd={end}
      />,
      getNode(),
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, 'mousedown', {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        setTimeout(() => {
          simulant.fire(document, 'mousemove', {
            button: 0,
            clientY: top + height / 2,
            clientX: left + width / 2,
          });
          simulant.fire(document, 'mouseup', {
            button: 0,
            clientY: top + height / 2,
            clientX: left + width / 2,
          });

          setTimeout(() => {
            expect(drag).toHaveBeenCalled();
            expect(start).toHaveBeenCalled();
            expect(end).toHaveBeenCalled();
            expect(start).toHaveBeenCalledBefore(drag);
            expect(drag).toHaveBeenCalledBefore(end);

            expect(drag.calls.argsFor(0)[0].y).toBe(top);
            expect(drag.calls.argsFor(0)[0].x).toBe(left);
            done();
          }, 5);
        }, 5);
      }
    );
  });

  it('should end the dragging if element was removed', (done) => {
    const start = jasmine.createSpy();
    const end = jasmine.createSpy();
    const drag = jasmine.createSpy();

    ReactDOM.render(
      <ScrollbarThumb
        axis={AXIS_DIRECTION.Y}
        style={{ width: 80, height: 100 }}
        onDragStart={start}
        onDrag={drag}
        onDragEnd={end}
      />,
      getNode(),
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, 'mousedown', {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        this.element = null;
        simulant.fire(document, 'mousemove', {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        setTimeout(() => {
          expect(drag).not.toHaveBeenCalled();
          expect(start).toHaveBeenCalled();
          expect(end).toHaveBeenCalled();

          expect(start).toHaveBeenCalledBefore(end);
          done();
        }, 5);
      }
    );
  });

  it('handleDragStart while element was removed should not emit callbacks', (done) => {
    const start = jasmine.createSpy();
    const end = jasmine.createSpy();
    const drag = jasmine.createSpy();

    ReactDOM.render(
      <ScrollbarThumb
        axis={AXIS_DIRECTION.Y}
        style={{ width: 80, height: 100 }}
        onDragStart={start}
        onDrag={drag}
        onDragEnd={end}
      />,
      getNode(),
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        const elt = this.element;
        this.element = null;
        simulant.fire(elt, 'mousedown', {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        setTimeout(() => {
          expect(drag).not.toHaveBeenCalled();
          expect(start).not.toHaveBeenCalled();
          expect(end).toHaveBeenCalled();
          done();
        }, 5);
      }
    );
  });

  it('while dragging element should have the `dragging` classname', (done) => {
    ReactDOM.render(
      <ScrollbarThumb axis={AXIS_DIRECTION.Y} style={{ width: 80, height: 100 }} />,
      getNode(),
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, 'mousedown', {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        setTimeout(() => {
          expect(this.element.classList.contains('dragging')).toBeTruthy();
          done();
        }, 5);
      }
    );
  });

  it('should end the dragging when component is unmounted', (done) => {
    const end = jasmine.createSpy();
    const node = getNode();

    ReactDOM.render(
      <ScrollbarThumb axis={AXIS_DIRECTION.Y} style={{ width: 80, height: 100 }} onDragEnd={end} />,
      node,
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, 'mousedown', {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });
        setTimeout(() => {
          simulant.fire(document, 'mousemove', {
            button: 0,
            clientY: top + height / 2,
            clientX: left + width / 2,
          });

          setTimeout(() => {
            ReactDOM.unmountComponentAtNode(node);
            expect(end).toHaveBeenCalled();

            done();
          }, 5);
        }, 5);
      }
    );
  });

  it('should set document`s user-select to none and replace onselectstart callback', (done) => {
    ReactDOM.render(
      <ScrollbarThumb axis={AXIS_DIRECTION.Y} style={{ width: 80, height: 100 }} />,
      getNode(),
      function () {
        const { top, height, left, width } = this.element.getBoundingClientRect();

        simulant.fire(this.element, 'mousedown', {
          button: 0,
          clientY: top + height / 2,
          clientX: left + width / 2,
        });

        setTimeout(() => {
          expect(document.body.style.userSelect).toBe('none');
          expect(document.onselectstart).toBe(null);

          done();
        }, 50);
      }
    );
  });
});
