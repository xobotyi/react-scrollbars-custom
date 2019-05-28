import * as ReactDOM from "react-dom";
import * as React from "react";
import cnb from "cnbuilder";
import * as simulant from "simulant";
import { _dbgSetIsReverseRTLScrollNeeded, _dbgSetScrollbarWidth } from "../src/util";
import Scrollbar, { ScrollbarContext, ScrollbarProps, ScrollbarState } from "../src";
import { ScrollbarContextValue } from "../src/Scrollbar";
import { ScrollState, TRACK_CLICK_BEHAVIOR } from "../src/common";

class ScrollbarPropsUpdater extends React.Component<
  { scrollbarProps: ScrollbarProps },
  { scrollbarProps: ScrollbarProps }
> {
  scrollbar: Scrollbar;

  constructor(props) {
    super(props);

    this.state = {
      scrollbarProps: this.props.scrollbarProps
    };
  }

  setScrollbarProps = (scrollbarProps: ScrollbarProps) => {
    this.setState({ scrollbarProps });
  };

  public render(): React.ReactElement<any> | null {
    return (
      <Scrollbar {...this.state.scrollbarProps} children={this.props.children} ref={ref => (this.scrollbar = ref)} />
    );
  }
}

describe("Scrollbar", () => {
  let node: HTMLDivElement;
  beforeAll(() => {
    node = document.createElement("div");
    document.body.appendChild(node);
  });
  beforeEach(() => {
    _dbgSetScrollbarWidth(null);
    _dbgSetIsReverseRTLScrollNeeded(null);
  });
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });
  afterAll(() => {
    ReactDOM.unmountComponentAtNode(node);
    document.body.removeChild(node);
  });

  describe("render", () => {
    it("should render proper DOM structure", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.wrapperElement.parentNode === this.holderElement).toBeTruthy();
            expect(this.scrollerElement.parentNode === this.wrapperElement).toBeTruthy();
            expect(this.contentElement.parentNode === this.scrollerElement).toBeTruthy();
            expect(this.trackXElement.parentNode === this.holderElement).toBeTruthy();
            expect(this.thumbXElement.parentNode === this.trackXElement).toBeTruthy();
            expect(this.trackYElement.parentNode === this.holderElement).toBeTruthy();
            expect(this.thumbYElement.parentNode === this.trackYElement).toBeTruthy();

            done();
          }, 20);
        }
      );
    });

    it("should apply classnames", done => {
      ReactDOM.render(
        <Scrollbar
          style={{ width: 100, height: 70 }}
          rtl
          className="customHolderClassname"
          wrapperProps={{ className: "customWrapperClassName" }}
          scrollerProps={{ className: "customScrollerClassName" }}
          contentProps={{ className: "customContentClassName" }}
          trackXProps={{ className: "customTrackXClassName" }}
          trackYProps={{ className: "customTrackYClassName" }}
          thumbXProps={{ className: "customThumbXClassName" }}
          thumbYProps={{ className: "customThumbYClassName" }}
        >
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.holderElement.classList.contains("ScrollbarsCustom")).toBeTruthy();
            expect(this.holderElement.classList.contains("trackYVisible")).toBeTruthy();
            expect(this.holderElement.classList.contains("trackXVisible")).toBeTruthy();
            expect(this.holderElement.classList.contains("rtl")).toBeTruthy();
            expect(this.holderElement.classList.contains("customHolderClassname")).toBeTruthy();

            expect(this.wrapperElement.classList.contains("ScrollbarsCustom-Wrapper")).toBeTruthy();
            expect(this.wrapperElement.classList.contains("customWrapperClassName")).toBeTruthy();

            expect(this.scrollerElement.classList.contains("ScrollbarsCustom-Scroller")).toBeTruthy();
            expect(this.scrollerElement.classList.contains("customScrollerClassName")).toBeTruthy();

            expect(this.contentElement.classList.contains("ScrollbarsCustom-Content")).toBeTruthy();
            expect(this.contentElement.classList.contains("customContentClassName")).toBeTruthy();

            expect(this.trackXElement.classList.contains("ScrollbarsCustom-Track")).toBeTruthy();
            expect(this.trackXElement.classList.contains("ScrollbarsCustom-TrackX")).toBeTruthy();
            expect(this.trackXElement.classList.contains("customTrackXClassName")).toBeTruthy();

            expect(this.trackYElement.classList.contains("ScrollbarsCustom-Track")).toBeTruthy();
            expect(this.trackYElement.classList.contains("ScrollbarsCustom-TrackY")).toBeTruthy();
            expect(this.trackYElement.classList.contains("customTrackYClassName")).toBeTruthy();

            expect(this.thumbXElement.classList.contains("ScrollbarsCustom-Thumb")).toBeTruthy();
            expect(this.thumbXElement.classList.contains("ScrollbarsCustom-ThumbX")).toBeTruthy();
            expect(this.thumbXElement.classList.contains("customThumbXClassName")).toBeTruthy();

            expect(this.thumbYElement.classList.contains("ScrollbarsCustom-Thumb")).toBeTruthy();
            expect(this.thumbYElement.classList.contains("ScrollbarsCustom-ThumbY")).toBeTruthy();
            expect(this.thumbYElement.classList.contains("customThumbYClassName")).toBeTruthy();

            done();
          }, 20);
        }
      );
    });

    it("should pass element references to elementRef props", done => {
      const holderRef = jasmine.createSpy();
      const wrapperRef = jasmine.createSpy();
      const scrollerRef = jasmine.createSpy();
      const contentRef = jasmine.createSpy();
      const trackXRef = jasmine.createSpy();
      const trackYRef = jasmine.createSpy();
      const thumbXRef = jasmine.createSpy();
      const thumbYRef = jasmine.createSpy();

      ReactDOM.render(
        <Scrollbar
          style={{ width: 100, height: 70 }}
          elementRef={holderRef}
          wrapperProps={{ elementRef: wrapperRef }}
          scrollerProps={{ elementRef: scrollerRef }}
          contentProps={{ elementRef: contentRef }}
          trackXProps={{ elementRef: trackXRef }}
          trackYProps={{ elementRef: trackYRef }}
          thumbXProps={{ elementRef: thumbXRef }}
          thumbYProps={{ elementRef: thumbYRef }}
        >
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(holderRef).toHaveBeenCalled();
            expect(wrapperRef).toHaveBeenCalled();
            expect(scrollerRef).toHaveBeenCalled();
            expect(contentRef).toHaveBeenCalled();
            expect(trackXRef).toHaveBeenCalled();
            expect(trackYRef).toHaveBeenCalled();
            expect(thumbXRef).toHaveBeenCalled();
            expect(thumbYRef).toHaveBeenCalled();

            expect(holderRef.calls.argsFor(0)[0]).toBe(this.holderElement);
            expect(wrapperRef.calls.argsFor(0)[0]).toBe(this.wrapperElement);
            expect(scrollerRef.calls.argsFor(0)[0]).toBe(this.scrollerElement);
            expect(contentRef.calls.argsFor(0)[0]).toBe(this.contentElement);
            expect(trackXRef.calls.argsFor(0)[0]).toBe(this.trackXElement);
            expect(trackYRef.calls.argsFor(0)[0]).toBe(this.trackYElement);
            expect(thumbXRef.calls.argsFor(0)[0]).toBe(this.thumbXElement);
            expect(thumbYRef.calls.argsFor(0)[0]).toBe(this.thumbYElement);

            done();
          }, 20);
        }
      );
    });

    it("should use renderer functions", done => {
      ReactDOM.render(
        <Scrollbar
          style={{ width: 100, height: 70 }}
          renderer={props => (
            <span
              ref={props.elementRef}
              style={props.style}
              children={props.children}
              className={cnb("customHolderClassname", props.className)}
            />
          )}
          wrapperProps={{
            renderer: props => (
              <span
                ref={props.elementRef}
                key={props.key}
                style={props.style}
                children={props.children}
                className={cnb("customWrapperClassName", props.className)}
              />
            )
          }}
          scrollerProps={{
            renderer: props => (
              <span
                ref={props.elementRef}
                key={props.key}
                style={props.style}
                children={props.children}
                className={cnb("customScrollerClassName", props.className)}
              />
            )
          }}
          contentProps={{
            renderer: props => (
              <span
                ref={props.elementRef}
                key={props.key}
                style={props.style}
                children={props.children}
                className={cnb("customContentClassName", props.className)}
              />
            )
          }}
          trackXProps={{
            renderer: props => (
              <span
                ref={props.elementRef}
                key={props.key}
                style={props.style}
                children={props.children}
                className={cnb("customTrackXClassName", props.className)}
              />
            )
          }}
          trackYProps={{
            renderer: props => (
              <span
                ref={props.elementRef}
                key={props.key}
                style={props.style}
                children={props.children}
                className={cnb("customTrackYClassName", props.className)}
              />
            )
          }}
          thumbXProps={{
            renderer: props => (
              <span
                ref={props.elementRef}
                key={props.key}
                style={props.style}
                children={props.children}
                className={cnb("customThumbXClassName", props.className)}
              />
            )
          }}
          thumbYProps={{
            renderer: props => (
              <span
                ref={props.elementRef}
                key={props.key}
                style={props.style}
                children={props.children}
                className={cnb("customThumbYClassName", props.className)}
              />
            )
          }}
        >
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.holderElement.tagName).toBe("SPAN");
            expect(this.holderElement.classList.contains("ScrollbarsCustom")).toBeTruthy();
            expect(this.holderElement.classList.contains("trackYVisible")).toBeTruthy();
            expect(this.holderElement.classList.contains("trackXVisible")).toBeTruthy();
            expect(this.holderElement.classList.contains("customHolderClassname")).toBeTruthy();

            expect(this.wrapperElement.tagName).toBe("SPAN");
            expect(this.wrapperElement.classList.contains("ScrollbarsCustom-Wrapper")).toBeTruthy();
            expect(this.wrapperElement.classList.contains("customWrapperClassName")).toBeTruthy();

            expect(this.scrollerElement.tagName).toBe("SPAN");
            expect(this.scrollerElement.classList.contains("ScrollbarsCustom-Scroller")).toBeTruthy();
            expect(this.scrollerElement.classList.contains("customScrollerClassName")).toBeTruthy();

            expect(this.contentElement.tagName).toBe("SPAN");
            expect(this.contentElement.classList.contains("ScrollbarsCustom-Content")).toBeTruthy();
            expect(this.contentElement.classList.contains("customContentClassName")).toBeTruthy();

            expect(this.trackXElement.tagName).toBe("SPAN");
            expect(this.trackXElement.classList.contains("ScrollbarsCustom-Track")).toBeTruthy();
            expect(this.trackXElement.classList.contains("ScrollbarsCustom-TrackX")).toBeTruthy();
            expect(this.trackXElement.classList.contains("customTrackXClassName")).toBeTruthy();

            expect(this.trackYElement.tagName).toBe("SPAN");
            expect(this.trackYElement.classList.contains("ScrollbarsCustom-Track")).toBeTruthy();
            expect(this.trackYElement.classList.contains("ScrollbarsCustom-TrackY")).toBeTruthy();
            expect(this.trackYElement.classList.contains("customTrackYClassName")).toBeTruthy();

            expect(this.thumbXElement.tagName).toBe("SPAN");
            expect(this.thumbXElement.classList.contains("ScrollbarsCustom-Thumb")).toBeTruthy();
            expect(this.thumbXElement.classList.contains("ScrollbarsCustom-ThumbX")).toBeTruthy();
            expect(this.thumbXElement.classList.contains("customThumbXClassName")).toBeTruthy();

            expect(this.thumbYElement.tagName).toBe("SPAN");
            expect(this.thumbYElement.classList.contains("ScrollbarsCustom-Thumb")).toBeTruthy();
            expect(this.thumbYElement.classList.contains("ScrollbarsCustom-ThumbY")).toBeTruthy();
            expect(this.thumbYElement.classList.contains("customThumbYClassName")).toBeTruthy();

            done();
          }, 60);
        }
      );
    });

    describe("in case of element absence", () => {
      let renderer = function(props) {
        return (
          <div className="custom stuff">
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
            errorInfo: errorInfo
          });
        }

        render() {
          if (this.state.errorInfo) {
            return false;
          }

          return this.props.children;
        }
      }

      it("should throw if holder element ref was not passed", done => {
        ReactDOM.render(
          <ErrorBoundary>
            <Scrollbar renderer={renderer} />
          </ErrorBoundary>,
          node,
          function() {
            setTimeout(() => {
              expect(this.state.error instanceof Error).toBeTruthy();
              expect(this.state.error.message).toBe(
                "holder element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
              );

              done();
            }, 10);
          }
        );
      });

      it("should throw if wrapper element ref was not passed", done => {
        ReactDOM.render(
          <ErrorBoundary>
            <Scrollbar wrapperProps={{ renderer }} />
          </ErrorBoundary>,
          node,
          function() {
            setTimeout(() => {
              expect(this.state.error instanceof Error).toBeTruthy();
              expect(this.state.error.message).toBe(
                "wrapper element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
              );

              done();
            }, 10);
          }
        );
      });

      it("should throw if scroller element ref was not passed", done => {
        ReactDOM.render(
          <ErrorBoundary>
            <Scrollbar scrollerProps={{ renderer }} />
          </ErrorBoundary>,
          node,
          function() {
            setTimeout(() => {
              expect(this.state.error instanceof Error).toBeTruthy();
              expect(this.state.error.message).toBe(
                "scroller element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
              );

              done();
            }, 10);
          }
        );
      });

      it("should throw if content element ref was not passed", done => {
        ReactDOM.render(
          <ErrorBoundary>
            <Scrollbar contentProps={{ renderer }} />
          </ErrorBoundary>,
          node,
          function() {
            setTimeout(() => {
              expect(this.state.error instanceof Error).toBeTruthy();
              expect(this.state.error.message).toBe(
                "content element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
              );

              done();
            }, 10);
          }
        );
      });

      it("should NOT throw if holder element ref was not passed and native=true", done => {
        ReactDOM.render(
          <ErrorBoundary>
            <Scrollbar renderer={renderer} native />
          </ErrorBoundary>,
          node,
          function() {
            setTimeout(() => {
              expect(this.state.error).toBeNull();
              done();
            }, 10);
          }
        );
      });

      it("should NOT throw if wrapper element ref was not passed and native=true", done => {
        ReactDOM.render(
          <ErrorBoundary>
            <Scrollbar wrapperProps={{ renderer }} native />
          </ErrorBoundary>,
          node,
          function() {
            setTimeout(() => {
              expect(this.state.error).toBeNull();
              done();
            }, 10);
          }
        );
      });
    });

    it("should render tracks if no scroll needed (by default)", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 100 }}>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.trackXElement).not.toBeNull();
            expect(this.thumbXElement).not.toBeNull();
            expect(this.trackYElement).not.toBeNull();
            expect(this.thumbYElement).not.toBeNull();

            done();
          }, 20);
        }
      );
    });

    it("should not render tracks if removeTracksWhenNotUsed passed", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 100 }} removeTracksWhenNotUsed>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.trackXElement).toBeNull();
            expect(this.thumbXElement).toBeNull();
            expect(this.trackYElement).toBeNull();
            expect(this.thumbYElement).toBeNull();

            done();
          }, 20);
        }
      );
    });

    it("should not render Y track if removeTrackYWhenNotUsed passed", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 100 }} removeTrackYWhenNotUsed>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.trackXElement).not.toBeNull();
            expect(this.thumbXElement).not.toBeNull();
            expect(this.trackYElement).toBeNull();
            expect(this.thumbYElement).toBeNull();

            done();
          }, 20);
        }
      );
    });

    it("should not render X track if removeTrackYWhenNotUsed passed", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 100 }} removeTrackXWhenNotUsed>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.trackXElement).toBeNull();
            expect(this.thumbXElement).toBeNull();
            expect(this.trackYElement).not.toBeNull();
            expect(this.thumbYElement).not.toBeNull();

            done();
          }, 20);
        }
      );
    });
  });

  describe("native", () => {
    it("should render scroller content element with given classnames", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 70 }} native rtl className="customHolderClassname">
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.holderElement).toBeNull();
            expect(this.wrapperElement).toBeNull();
            expect(this.trackYElement).toBeNull();
            expect(this.thumbYElement).toBeNull();
            expect(this.trackXElement).toBeNull();
            expect(this.thumbXElement).toBeNull();

            expect(this.scrollerElement.__proto__.toString()).toBe("[object HTMLDivElement]");
            expect(this.contentElement.__proto__.toString()).toBe("[object HTMLDivElement]");
            expect(this.scrollerElement.classList.contains("native")).toBeTruthy();
            expect(this.scrollerElement.classList.contains("rtl")).toBeTruthy();
            expect(this.scrollerElement.classList.contains("trackYVisible")).toBeTruthy();
            expect(this.scrollerElement.classList.contains("trackXVisible")).toBeTruthy();
            expect(this.scrollerElement.classList.contains("ScrollbarsCustom")).toBeTruthy();

            expect(this.contentElement.classList.contains("ScrollbarsCustom-Content")).toBeTruthy();
            done();
          }, 30);
        }
      );
    });

    it("should apply props scroll values", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 70 }} native scrollLeft={20} scrollTop={40}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.scrollerElement.scrollTop).toBe(40);
            expect(this.scrollerElement.scrollLeft).toBe(20);
            done();
          }, 30);
        }
      );
    });

    it("should apply noScroll parameter", done => {
      ReactDOM.render(
        <Scrollbar native noScroll style={{ width: 100, height: 70 }}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          expect(this.scrollerElement.style.overflowX).toBe("hidden");
          expect(this.scrollerElement.style.overflowY).toBe("hidden");
          done();
        }
      );
    });
    it("should apply noScrollX parameter", done => {
      ReactDOM.render(
        <Scrollbar native noScrollX style={{ width: 100, height: 70 }}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          expect(this.scrollerElement.style.overflowX).toBe("hidden");
          expect(this.scrollerElement.style.overflowY).not.toBe("hidden");
          done();
        }
      );
    });
    it("should apply noScrollY parameter", done => {
      ReactDOM.render(
        <Scrollbar native noScrollY style={{ width: 100, height: 70 }}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          expect(this.scrollerElement.style.overflowX).not.toBe("hidden");
          expect(this.scrollerElement.style.overflowY).toBe("hidden");
          done();
        }
      );
    });

    it("should apply permanentTracks parameter", done => {
      ReactDOM.render(
        <Scrollbar native permanentTracks style={{ width: 100, height: 70 }}>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          expect(this.scrollerElement.style.overflowX).toBe("scroll");
          expect(this.scrollerElement.style.overflowY).toBe("scroll");
          done();
        }
      );
    });
    it("should apply permanentTrackX parameter", done => {
      ReactDOM.render(
        <Scrollbar native permanentTrackX style={{ width: 100, height: 70 }}>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          expect(this.scrollerElement.style.overflowX).toBe("scroll");
          expect(this.scrollerElement.style.overflowY).not.toBe("scroll");
          done();
        }
      );
    });
    it("should apply permanentTrackY parameter", done => {
      ReactDOM.render(
        <Scrollbar native permanentTrackY style={{ width: 100, height: 70 }}>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          expect(this.scrollerElement.style.overflowX).not.toBe("scroll");
          expect(this.scrollerElement.style.overflowY).toBe("scroll");
          done();
        }
      );
    });
  });

  describe("scroll setters", () => {
    describe(".scrollToRight()", () => {
      it("should scroll to the right content's border", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.scrollToRight();

            setTimeout(() => {
              expect(this.scrollerElement.scrollLeft).toBe(800);

              done();
            }, 20);
          }
        );
      });
    });
    describe(".scrollToLeft()", () => {
      it("should scroll to the left content's border", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.scrollToRight();
            this.scrollToLeft();

            setTimeout(() => {
              expect(this.contentElement.scrollLeft).toBe(0);

              done();
            }, 20);
          }
        );
      });
    });
    describe(".scrollToBottom()", () => {
      it("should scroll to the bottom content's border", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.scrollToBottom();

            setTimeout(() => {
              expect(this.scrollerElement.scrollTop).toBe(900);

              done();
            }, 20);
          }
        );
      });
    });
    describe(".scrollToTop()", () => {
      it("should scroll to the top content's border", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.scrollToBottom();
            this.scrollToTop();

            setTimeout(() => {
              expect(this.contentElement.scrollTop).toBe(0);

              done();
            }, 20);
          }
        );
      });
    });
    describe(".scrollTo(x,y)", () => {
      it("should set left top viewport's corner at given coordinates ", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.scrollTo(400, 560);

            setTimeout(() => {
              expect(this.scrollerElement.scrollLeft).toBe(400);
              expect(this.scrollerElement.scrollTop).toBe(560);

              done();
            }, 20);
          }
        );
      });
    });
    describe(".centerAt(x,y)", () => {
      it("should center the viewport at given coordinates ", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.centerAt(400, 560);

            setTimeout(() => {
              expect(this.scrollerElement.scrollLeft).toBe(350);
              expect(this.scrollerElement.scrollTop).toBe(510);

              done();
            }, 20);
          }
        );
      });
    });
    describe(".scrollTop", () => {
      it("should set the content's scrollTop position", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.scrollTop = 450;
            expect(this.scrollerElement.scrollTop).toBe(450);

            done();
          }
        );
      });
    });
    describe(".scrollLeft", () => {
      it("should set the content's scrollTop position", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.scrollLeft = 450;
            expect(this.scrollerElement.scrollLeft).toBe(450);

            done();
          }
        );
      });
    });

    describe("in case of scroller element absence *just for LOC coverage*", () => {
      it("do nothing", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            //simulate weird behaviour
            this.scrollerElement = null;

            this.scrollLeft = 100;
            this.scrollTop = 100;
            this.scrollToRight();
            this.scrollToLeft();
            this.scrollToTop();
            this.scrollToBottom();
            this.scrollTo(1, 2);
            this.centerAt(1, 2);

            expect(this.update()).toBeUndefined();

            done();
          }
        );
      });
    });
  });

  describe("scroll getters", () => {
    describe(".getScrollValues", () => {
      it("should return proper values", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }} scrollTop={450} scrollLeft={400}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            setTimeout(() => {
              const scrollValues = this.getScrollState();

              expect(scrollValues.clientHeight).toBe(this.scrollerElement.clientHeight);
              expect(scrollValues.clientWidth).toBe(this.scrollerElement.clientWidth);
              expect(scrollValues.scrollHeight).toBe(this.scrollerElement.scrollHeight);
              expect(scrollValues.scrollWidth).toBe(this.scrollerElement.scrollWidth);
              expect(scrollValues.scrollTop).toBe(this.scrollerElement.scrollTop);
              expect(scrollValues.scrollLeft).toBe(this.scrollerElement.scrollLeft);
              expect(scrollValues.scrollYBlocked).toBeFalsy();
              expect(scrollValues.scrollXBlocked).toBeFalsy();
              expect(scrollValues.scrollYPossible).toBeTruthy();
              expect(scrollValues.scrollXPossible).toBeTruthy();
              expect(scrollValues.trackYVisible).toBeTruthy();
              expect(scrollValues.trackXVisible).toBeTruthy();
              expect(scrollValues.isRTL).toBeFalsy();

              done();
            }, 60);
          }
        );
      });
    });

    describe(".scrollTop", () => {
      it("should return proper value", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.scrollerElement.scrollTop = 450;

            expect(this.scrollTop).toBe(450);

            done();
          }
        );
      });
    });

    describe(".scrollLeft", () => {
      it("should return proper value", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            this.scrollerElement.scrollLeft = 450;
            expect(this.scrollLeft).toBe(450);

            done();
          }
        );
      });
    });

    describe(".scrollHeight", () => {
      it("should return proper value", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            expect(this.scrollHeight).toBe(1000);

            done();
          }
        );
      });
    });

    describe(".scrollWidth", () => {
      it("should return proper value", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            expect(this.scrollWidth).toBe(900);

            done();
          }
        );
      });
    });

    describe(".clientHeight", () => {
      it("should return proper value", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 200 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            expect(this.clientHeight).toBe(200);

            done();
          }
        );
      });
    });

    describe(".clientWidth", () => {
      it("should return proper value", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 200 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            expect(this.clientWidth).toBe(100);

            done();
          }
        );
      });
    });

    describe("in case of scroller element absence *just for LOC coverage*", () => {
      it("return 0", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            //simulate weird behaviour
            this.scrollerElement = null;

            expect(this.scrollLeft).toBe(0);
            expect(this.scrollTop).toBe(0);
            expect(this.clientHeight).toBe(0);
            expect(this.clientWidth).toBe(0);
            expect(this.scrollHeight).toBe(0);
            expect(this.scrollWidth).toBe(0);

            done();
          }
        );
      });
    });
  });

  describe("props", () => {
    describe("should not compensate respective track's width", () => {
      it("if disableTracksWidthCompensation passed", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 110 }} disableTracksWidthCompensation>
            <div style={{ width: 200, height: 210 }} />
          </Scrollbar>,
          node,
          function() {
            setTimeout(() => {
              expect(this.wrapperElement.clientWidth).toBe(this.holderElement.clientWidth);
              expect(this.wrapperElement.clientHeight).toBe(this.holderElement.clientHeight);
              done();
            }, 50);
          }
        );
      });
      it("if disableTrackYWidthCompensation passed", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 110 }} disableTrackYWidthCompensation>
            <div style={{ width: 200, height: 210 }} />
          </Scrollbar>,
          node,
          function() {
            setTimeout(() => {
              expect(this.wrapperElement.clientWidth).toBe(this.holderElement.clientWidth);
              expect(this.wrapperElement.clientHeight).not.toBe(this.holderElement.clientHeight);
              done();
            }, 50);
          }
        );
      });

      it("if disableTrackXWidthCompensation passed", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 110 }} disableTrackXWidthCompensation>
            <div style={{ width: 200, height: 210 }} />
          </Scrollbar>,
          node,
          function() {
            setTimeout(() => {
              expect(this.wrapperElement.clientWidth).not.toBe(this.holderElement.clientWidth);
              expect(this.wrapperElement.clientHeight).toBe(this.holderElement.clientHeight);
              done();
            }, 50);
          }
        );
      });
    });

    it("should translate content's size to the holder element if translateContentSizesToHolder is passed", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 0, height: 0 }} translateContentSizesToHolder>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.holderElement.clientWidth).toBe(this.contentElement.scrollWidth);
            expect(this.holderElement.clientHeight).toBe(this.contentElement.scrollHeight);
            done();
          }, 50);
        }
      );
    });

    it("should translate content's width to the holder element if translateContentSizeXToHolder is passed", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 0, height: 0 }} translateContentSizeXToHolder>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.holderElement.clientWidth).toBe(this.contentElement.scrollWidth);
            expect(this.holderElement.clientHeight).not.toBe(this.contentElement.scrollHeight);
            done();
          }, 50);
        }
      );
    });

    it("should translate content's height to the holder element if translateContentSizeYToHolder is passed", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 0, height: 0 }} translateContentSizeYToHolder>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.holderElement.clientWidth).not.toBe(this.contentElement.scrollWidth);
            expect(this.holderElement.clientHeight).toBe(this.contentElement.scrollHeight);
            done();
          }, 50);
        }
      );
    });

    it("should create context if createContext is passed", done => {
      let consumedContext: ScrollbarContextValue;

      class ScrollbarContextConsumer extends React.Component<{}, {}> {
        static contextType = ScrollbarContext;

        public componentDidMount(): void {
          consumedContext = this.context;
        }

        render() {
          return <div className="element" />;
        }
      }

      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 70 }} scrollLeft={20} scrollTop={40} createContext>
          <ScrollbarContextConsumer />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(consumedContext).not.toBeUndefined();
            expect(consumedContext!.parentScrollbar).toBe(this);
            done();
          }, 50);
        }
      );
    });

    it("should apply props scroll values", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 70 }} scrollLeft={20} scrollTop={40}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.scrollerElement.scrollTop).toBe(40);
            expect(this.scrollerElement.scrollLeft).toBe(20);
            done();
          }, 30);
        }
      );
    });

    it("should apply fallback scrollbar width if scrollbarWidth is 0", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 70 }} scrollbarWidth={0} fallbackScrollbarWidth={11}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.scrollerElement.style.marginRight).toBe("-11px");
            done();
          }, 30);
        }
      );
    });

    it("should apply props scroll values", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 70 }} scrollLeft={20} scrollTop={40}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.scrollerElement.scrollTop).toBe(40);
            expect(this.scrollerElement.scrollLeft).toBe(20);
            done();
          }, 30);
        }
      );
    });

    it("should apply noScroll parameter", done => {
      ReactDOM.render(
        <Scrollbar noScroll style={{ width: 100, height: 70 }}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.scrollerElement.style.overflowX).toBe("hidden");
            expect(this.scrollerElement.style.overflowY).toBe("hidden");
            done();
          }, 50);
        }
      );
    });
    it("should apply noScrollX parameter", done => {
      ReactDOM.render(
        <Scrollbar noScrollX style={{ width: 100, height: 70 }}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.scrollerElement.style.overflowX).toBe("hidden");
            expect(this.scrollerElement.style.overflowY).not.toBe("hidden");
            done();
          }, 30);
        }
      );
    });
    it("should apply noScrollY parameter", done => {
      ReactDOM.render(
        <Scrollbar noScrollY style={{ width: 100, height: 70 }}>
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.scrollerElement.style.overflowX).not.toBe("hidden");
            expect(this.scrollerElement.style.overflowY).toBe("hidden");
            done();
          }, 30);
        }
      );
    });

    it("should apply permanentTracks parameter", done => {
      ReactDOM.render(
        <Scrollbar permanentTracks style={{ width: 100, height: 70 }}>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.trackYElement.style.display).not.toBe("none");
            expect(this.trackXElement.style.display).not.toBe("none");

            done();
          }, 30);
        }
      );
    });
    it("should apply permanentTrackX parameter", done => {
      ReactDOM.render(
        <Scrollbar permanentTrackX style={{ width: 100, height: 70 }}>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.trackYElement.style.display).toBe("none");
            expect(this.trackXElement.style.display).not.toBe("none");

            done();
          }, 30);
        }
      );
    });
    it("should apply permanentTrackY parameter", done => {
      ReactDOM.render(
        <Scrollbar permanentTrackY style={{ width: 100, height: 70 }}>
          <div style={{ width: 50, height: 50 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.trackYElement.style.display).not.toBe("none");
            expect(this.trackXElement.style.display).toBe("none");

            done();
          }, 30);
        }
      );
    });

    describe("should update state state when respective props changed", () => {
      it("should update rtl state", done => {
        let setScrollbarProps;
        ReactDOM.render(
          <ScrollbarPropsUpdater
            ref={ref => (setScrollbarProps = ref && ref.setScrollbarProps)}
            scrollbarProps={{ style: { width: 100, height: 70 } }}
          >
            <div style={{ width: 200, height: 200 }} />
          </ScrollbarPropsUpdater>,
          node,
          function() {
            setScrollbarProps({ rtl: true });
            setTimeout(() => {
              expect(this.scrollbar.state.isRTL).toBeTruthy();

              setScrollbarProps({ rtl: false });
              setTimeout(() => {
                expect(this.scrollbar.state.isRTL).toBeFalsy();

                done();
              }, 30);
            }, 30);
          }
        );
      });

      it("should update scrollTop and scrollLeft", done => {
        let setScrollbarProps;
        ReactDOM.render(
          <ScrollbarPropsUpdater
            ref={ref => (setScrollbarProps = ref && ref.setScrollbarProps)}
            scrollbarProps={{ style: { width: 100, height: 70 } }}
          >
            <div style={{ width: 200, height: 200 }} />
          </ScrollbarPropsUpdater>,
          node,
          function() {
            setScrollbarProps({
              style: { width: 100, height: 70 },
              scrollTop: 20,
              scrollLeft: 40
            });
            setTimeout(() => {
              expect(this.scrollbar.scrollerElement.scrollTop).toBe(20);
              expect(this.scrollbar.scrollerElement.scrollLeft).toBe(40);

              setScrollbarProps({
                style: { width: 100, height: 70 },
                scrollTop: 40,
                scrollLeft: 50
              });
              setTimeout(() => {
                expect(this.scrollbar.scrollerElement.scrollTop).toBe(40);
                expect(this.scrollbar.scrollerElement.scrollLeft).toBe(50);

                setScrollbarProps({ style: { width: 100, height: 70 } });
                setTimeout(() => {
                  expect(this.scrollbar.scrollerElement.scrollTop).toBe(40);
                  expect(this.scrollbar.scrollerElement.scrollLeft).toBe(50);

                  done();
                }, 50);
              }, 50);
            }, 50);
          }
        );
      });

      it("should update noScroll* props", done => {
        let setScrollbarProps;
        ReactDOM.render(
          <ScrollbarPropsUpdater
            ref={ref => (setScrollbarProps = ref && ref.setScrollbarProps)}
            scrollbarProps={{ style: { width: 100, height: 70 } }}
          >
            <div style={{ width: 200, height: 200 }} />
          </ScrollbarPropsUpdater>,
          node,
          function() {
            setScrollbarProps({
              style: { width: 100, height: 70 },
              noScroll: true
            });
            setTimeout(() => {
              expect(this.scrollbar.scrollerElement.style.overflowX).toBe("hidden");
              expect(this.scrollbar.scrollerElement.style.overflowY).toBe("hidden");

              setScrollbarProps({
                style: { width: 100, height: 70 },
                noScrollX: true
              });
              setTimeout(() => {
                expect(this.scrollbar.scrollerElement.style.overflowX).toBe("hidden");
                expect(this.scrollbar.scrollerElement.style.overflowY).not.toBe("hidden");

                setScrollbarProps({
                  style: { width: 100, height: 70 },
                  noScrollY: true
                });
                setTimeout(() => {
                  expect(this.scrollbar.scrollerElement.style.overflowX).not.toBe("hidden");
                  expect(this.scrollbar.scrollerElement.style.overflowY).toBe("hidden");

                  setScrollbarProps({ style: { width: 100, height: 70 } });
                  setTimeout(() => {
                    expect(this.scrollbar.scrollerElement.style.overflowX).not.toBe("hidden");
                    expect(this.scrollbar.scrollerElement.style.overflowY).not.toBe("hidden");

                    done();
                  }, 30);
                }, 30);
              }, 30);
            }, 30);
          }
        );
      });

      it("should update permanentTrack* props", done => {
        let setScrollbarProps;
        ReactDOM.render(
          <ScrollbarPropsUpdater
            ref={ref => (setScrollbarProps = ref && ref.setScrollbarProps)}
            scrollbarProps={{
              style: { width: 100, height: 70 },
              noScroll: true
            }}
          >
            <div style={{ width: 200, height: 200 }} />
          </ScrollbarPropsUpdater>,
          node,
          function() {
            setScrollbarProps({
              style: { width: 100, height: 70 },
              noScroll: true,
              permanentTracks: true
            });
            setTimeout(() => {
              expect(this.scrollbar.trackXElement.style.display).not.toBe("none");
              expect(this.scrollbar.trackYElement.style.display).not.toBe("none");

              setScrollbarProps({
                style: { width: 100, height: 70 },
                noScroll: true,
                permanentTrackX: true
              });
              setTimeout(() => {
                expect(this.scrollbar.trackXElement.style.display).not.toBe("none");
                expect(this.scrollbar.trackYElement.style.display).toBe("none");

                setScrollbarProps({
                  style: { width: 100, height: 70 },
                  noScroll: true,
                  permanentTrackY: true
                });
                setTimeout(() => {
                  expect(this.scrollbar.trackXElement.style.display).toBe("none");
                  expect(this.scrollbar.trackYElement.style.display).not.toBe("none");

                  setScrollbarProps({
                    style: { width: 100, height: 70 },
                    noScroll: true
                  });
                  setTimeout(() => {
                    expect(this.scrollbar.trackXElement.style.display).toBe("none");
                    expect(this.scrollbar.trackYElement.style.display).toBe("none");

                    done();
                  }, 30);
                }, 30);
              }, 30);
            }, 30);
          }
        );
      });
    });
  });

  describe("static methods", () => {
    describe(".calculateStyles()", () => {
      const props: ScrollbarProps = {
        wrapperProps: {},
        contentProps: {},
        scrollerProps: {},
        trackYProps: {},
        trackXProps: {},
        thumbXProps: {},
        thumbYProps: {}
      };
      const state: ScrollbarState = {
        trackYVisible: true,
        trackXVisible: true
      };
      const scrollState: ScrollState = {
        clientHeight: 0,
        clientWidth: 0,

        contentScrollHeight: 0,
        contentScrollWidth: 0,

        scrollHeight: 0,
        scrollWidth: 0,
        scrollTop: 0,
        scrollLeft: 0,
        scrollYBlocked: false,
        scrollXBlocked: false,
        scrollYPossible: true,
        scrollXPossible: true,
        trackYVisible: true,
        trackXVisible: true,
        isRTL: undefined
      };

      it("should return proper rtl styles", () => {
        let result = Scrollbar.calculateStyles(
          {
            ...props,
            rtl: true
          },
          {
            ...state,
            isRTL: true
          },
          scrollState,
          17
        );

        expect(result.scroller.direction).toBe("rtl");
        expect(result.wrapper.left).toBe(10);

        result = Scrollbar.calculateStyles(
          {
            ...props,
            rtl: false
          },
          {
            ...state,
            isRTL: false
          },
          scrollState,
          17
        );
        expect(result.scroller.direction).toBe("ltr");
        expect(result.wrapper.right).toBe(10);

        result = Scrollbar.calculateStyles(
          {
            ...props,
            rtl: undefined
          },
          {
            ...state,
            isRTL: false
          },
          scrollState,
          17
        );
        expect(result.scroller.direction).toBe(undefined);
        expect(result.wrapper.right).toBe(10);
      });

      it("should return proper content paddings for mobile browsers", () => {
        let result = Scrollbar.calculateStyles(
          {
            ...props,
            rtl: true,
            fallbackScrollbarWidth: 20
          },
          {
            ...state,
            isRTL: true
          },
          scrollState,
          0
        );

        expect(result.scroller.paddingBottom).toBe(20);
        expect(result.scroller.paddingLeft).toBe(20);
        expect(result.scroller.paddingRight).toBe(undefined);
        expect(result.scroller.marginLeft).toBe(-20);
        expect(result.scroller.marginRight).toBe(undefined);

        result = Scrollbar.calculateStyles(
          {
            ...props,
            fallbackScrollbarWidth: 20
          },
          {
            ...state,
            isRTL: false
          },
          scrollState,
          0
        );

        expect(result.scroller.paddingBottom).toBe(20);
        expect(result.scroller.paddingRight).toBe(20);
        expect(result.scroller.paddingLeft).toBe(undefined);
        expect(result.scroller.marginRight).toBe(-20);
        expect(result.scroller.marginLeft).toBe(undefined);

        result = Scrollbar.calculateStyles(
          {
            ...props,
            fallbackScrollbarWidth: 20
          },
          {
            ...state,
            isRTL: true
          },
          {
            ...scrollState,
            scrollYPossible: false
          },
          0
        );

        expect(result.scroller.paddingLeft).toBe(undefined);
        expect(result.scroller.marginLeft).toBe(undefined);
      });
    });
  });

  describe("callbacks", () => {
    it("these goes for coverage to ensure it is triggered", done => {
      const onUpdateSpy1 = jasmine.createSpy();
      const onUpdateSpy2 = jasmine.createSpy();

      const onScrollSpy1 = jasmine.createSpy();
      const onScrollSpy2 = jasmine.createSpy();

      const onScrollStartSpy1 = jasmine.createSpy();
      const onScrollStartSpy2 = jasmine.createSpy();

      const onScrollStopSpy1 = jasmine.createSpy();
      const onScrollStopSpy2 = jasmine.createSpy();

      let setScrollbarProps;

      ReactDOM.render(
        <ScrollbarPropsUpdater
          ref={ref => (setScrollbarProps = ref && ref.setScrollbarProps)}
          scrollbarProps={{
            onUpdate: onUpdateSpy1,
            onScroll: onScrollSpy1,
            onScrollStart: onScrollStartSpy1,
            onScrollStop: onScrollStopSpy1
          }}
        >
          <div style={{ width: 200, height: 200 }} />
        </ScrollbarPropsUpdater>,
        node,
        function() {
          setScrollbarProps({
            onUpdate: onUpdateSpy2,
            onScroll: onScrollSpy2,
            onScrollStart: onScrollStartSpy2,
            onScrollStop: onScrollStopSpy2
          });

          setTimeout(() => {
            done();
          }, 30);
        }
      );
    });

    it("should call an onScroll only if scroll has changed", done => {
      let setScrollbarProps;
      let spy = jasmine.createSpy("scroll", scrollValues => {
        console.log(scrollValues.scrollTop, scrollValues.scrollLeft);
      });

      ReactDOM.render(
        <ScrollbarPropsUpdater
          ref={ref => (setScrollbarProps = ref && ref.setScrollbarProps)}
          scrollbarProps={{
            style: { width: 100, height: 70 },
            noScroll: true,
            onScroll: spy
          }}
        >
          <div style={{ width: 200, height: 200 }} />
        </ScrollbarPropsUpdater>,
        node,
        function() {
          expect(spy).not.toHaveBeenCalled();
          setScrollbarProps({
            style: { width: 100, height: 70 },
            scrollTop: 10,
            scrollLeft: 20,
            onScroll: spy
          });
          setTimeout(() => {
            expect(spy).toHaveBeenCalledTimes(1);

            setScrollbarProps({
              style: { width: 90, height: 60 },
              scrollTop: 10,
              scrollLeft: 20,
              onScroll: spy
            });
            setTimeout(() => {
              expect(spy).toHaveBeenCalledTimes(1);
              done();
            }, 30);
          }, 30);
        }
      );
    });

    it("should call a track's onClick in spite of scroll possibility", done => {
      const spyX = jasmine.createSpy();
      const spyY = jasmine.createSpy();

      ReactDOM.render(
        <Scrollbar
          style={{ width: 100, height: 100, position: "relative" }}
          trackXProps={{ onClick: spyX }}
          trackYProps={{ onClick: spyY }}
          noScroll
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            const {
              top: topX,
              height: heightX,
              left: leftX,
              width: widthX
            } = this.trackXElement.getBoundingClientRect();
            const {
              top: topY,
              height: heightY,
              left: leftY,
              width: widthY
            } = this.trackYElement.getBoundingClientRect();

            simulant.fire(this.trackXElement, "click", {
              which: 1,
              clientY: topX + heightX / 2,
              clientX: leftX + widthX / 2
            });
            simulant.fire(this.trackYElement, "click", {
              which: 1,
              clientY: topY + heightY / 2,
              clientX: leftY + widthY / 2
            });

            setTimeout(() => {
              expect(spyX).toHaveBeenCalled();
              expect(spyY).toHaveBeenCalled();

              done();
            }, 20);
          }, 20);
        }
      );
    });

    it("should call a track's onWheel in spite of scroll possibility", done => {
      const spyX = jasmine.createSpy();
      const spyY = jasmine.createSpy();

      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.JUMP}
          trackXProps={{ onWheel: spyX }}
          trackYProps={{ onWheel: spyY }}
          style={{ width: 100, height: 100, position: "relative" }}
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          // due to inability to emulate scroll event
          this.handleTrackYMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });
          this.handleTrackXMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });

          setTimeout(() => {
            expect(spyX).toHaveBeenCalled();
            expect(spyY).toHaveBeenCalled();

            done();
          }, 20);
        }
      );
    });
  });

  describe("track interaction", () => {
    it("should perform a scroll while mousewheel over tracks", done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          // due to inability to emulate scroll event
          this.handleTrackYMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });
          this.handleTrackXMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });

          setTimeout(() => {
            expect(this.scrollerElement.scrollTop).toBe(120);
            expect(this.scrollerElement.scrollLeft).toBe(100);

            done();
          }, 20);
        }
      );
    });

    it("should not perform a scroll while mousewheel over tracks and `disableTracksMousewheelScrolling` passed", done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
          disableTracksMousewheelScrolling
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          // due to inability to emulate scroll event
          this.handleTrackYMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });
          this.handleTrackXMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });

          setTimeout(() => {
            expect(this.scrollerElement.scrollTop).toBe(0);
            expect(this.scrollerElement.scrollLeft).toBe(0);

            done();
          }, 20);
        }
      );
    });

    it("should not perform vertical scroll while mousewheel over tracks and `disableTrackYMousewheelScrolling` passed", done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
          disableTrackYMousewheelScrolling
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          // due to inability to emulate scroll event
          this.handleTrackYMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });
          this.handleTrackXMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });

          setTimeout(() => {
            expect(this.scrollerElement.scrollTop).toBe(0);
            expect(this.scrollerElement.scrollLeft).toBe(100);

            done();
          }, 20);
        }
      );
    });

    it("should not perform vertical scroll while mousewheel over tracks and `disableTrackXMousewheelScrolling` passed", done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
          disableTrackXMousewheelScrolling
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          // due to inability to emulate scroll event
          this.handleTrackYMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });
          this.handleTrackXMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });

          setTimeout(() => {
            expect(this.scrollerElement.scrollTop).toBe(120);
            expect(this.scrollerElement.scrollLeft).toBe(0);

            done();
          }, 20);
        }
      );
    });

    it("should not perform a scroll while mousewheel over tracks and scrolling is diabled", done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
          noScroll
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          // due to inability to emulate scroll event
          this.handleTrackYMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });
          this.handleTrackXMouseWheel({
            deltaX: 100,
            deltaY: 120,
            deltaMode: 0
          });

          setTimeout(() => {
            expect(this.contentElement.scrollTop).toBe(0);
            expect(this.contentElement.scrollLeft).toBe(0);

            done();
          }, 20);
        }
      );
    });

    it("should not perform a scroll if scrolling disabled", done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
          noScroll
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          const { top: topX, height: heightX, left: leftX, width: widthX } = this.trackXElement.getBoundingClientRect();
          const { top: topY, height: heightY, left: leftY, width: widthY } = this.trackYElement.getBoundingClientRect();

          simulant.fire(this.trackXElement, "click", {
            which: 1,
            clientY: topX + heightX / 2,
            clientX: leftX + widthX / 2
          });
          simulant.fire(this.trackYElement, "click", {
            which: 1,
            clientY: topY + heightY / 2,
            clientX: leftY + widthY / 2
          });

          setTimeout(() => {
            expect(this.contentElement.scrollTop).toBe(0);
            expect(this.contentElement.scrollLeft).toBe(0);

            done();
          }, 20);
        }
      );
    });

    it('track click should cause `jump` to the respective position if `trackClickBehavior="jump"`', done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            const {
              top: topX,
              height: heightX,
              left: leftX,
              width: widthX
            } = this.trackXElement.getBoundingClientRect();
            const {
              top: topY,
              height: heightY,
              left: leftY,
              width: widthY
            } = this.trackYElement.getBoundingClientRect();

            simulant.fire(this.trackXElement, "click", {
              which: 1,
              clientY: Math.floor(topX + heightX / 2),
              clientX: Math.floor(leftX + widthX / 2)
            });
            simulant.fire(this.trackYElement, "click", {
              which: 1,
              clientY: Math.floor(topY + heightY / 2),
              clientX: Math.floor(leftY + widthY / 2)
            });

            setTimeout(() => {
              expect(this.scrollerElement.scrollTop).toBe(
                Math.floor((this.scrollerElement.scrollHeight - this.scrollerElement.clientHeight) / 2)
              );
              expect(this.scrollerElement.scrollLeft).toBe(
                Math.floor((this.scrollerElement.scrollWidth - this.scrollerElement.clientWidth) / 2)
              );

              done();
            }, 20);
          }, 20);
        }
      );
    });

    it('[RTL] track click should cause `jump` to the respective position if `trackClickBehavior="jump"`', done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
          rtl
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            const {
              top: topX,
              height: heightX,
              left: leftX,
              width: widthX
            } = this.trackXElement.getBoundingClientRect();
            const {
              top: topY,
              height: heightY,
              left: leftY,
              width: widthY
            } = this.trackYElement.getBoundingClientRect();

            simulant.fire(this.trackXElement, "click", {
              which: 1,
              clientY: Math.floor(topX + heightX / 2),
              clientX: Math.floor(leftX + widthX / 2)
            });
            simulant.fire(this.trackYElement, "click", {
              which: 1,
              clientY: Math.floor(topY + heightY / 2),
              clientX: Math.floor(leftY + widthY / 2)
            });

            setTimeout(() => {
              expect(this.scrollerElement.scrollTop).toBe(
                Math.floor((this.scrollerElement.scrollHeight - this.scrollerElement.clientHeight) / 2)
              );
              expect(this.scrollerElement.scrollLeft).toBe(
                Math.floor((this.scrollerElement.scrollWidth - this.scrollerElement.clientWidth) / 2)
              );

              done();
            }, 20);
          }, 20);
        }
      );
    });

    it('track click should cause `step` towards clicked position if `trackClickBehavior="step"`', done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.STEP}
          style={{ width: 100, height: 100, position: "relative" }}
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            const {
              top: topX,
              height: heightX,
              left: leftX,
              width: widthX
            } = this.trackXElement.getBoundingClientRect();
            const {
              top: topY,
              height: heightY,
              left: leftY,
              width: widthY
            } = this.trackYElement.getBoundingClientRect();

            simulant.fire(this.trackXElement, "click", {
              which: 1,
              clientY: topX + heightX / 2,
              clientX: leftX + widthX / 2
            });
            simulant.fire(this.trackYElement, "click", {
              which: 1,
              clientY: topY + heightY / 2,
              clientX: leftY + widthY / 2
            });

            setTimeout(() => {
              expect(this.scrollerElement.scrollTop).toBe(this.scrollerElement.clientHeight);
              expect(this.scrollerElement.scrollLeft).toBe(this.scrollerElement.clientWidth);

              simulant.fire(this.trackXElement, "click", {
                which: 1,
                clientY: topX + heightX / 2,
                clientX: leftX + widthX / 2
              });
              simulant.fire(this.trackYElement, "click", {
                which: 1,
                clientY: topY + heightY / 2,
                clientX: leftY + widthY / 2
              });

              setTimeout(() => {
                expect(this.scrollerElement.scrollTop).toBe(2 * this.scrollerElement.clientHeight);
                expect(this.scrollerElement.scrollLeft).toBe(2 * this.scrollerElement.clientWidth);

                simulant.fire(this.trackXElement, "click", {
                  which: 1,
                  clientY: topX,
                  clientX: leftX
                });
                simulant.fire(this.trackYElement, "click", {
                  which: 1,
                  clientY: topY,
                  clientX: leftY
                });

                setTimeout(() => {
                  expect(this.scrollerElement.scrollTop).toBe(this.scrollerElement.clientHeight);
                  expect(this.scrollerElement.scrollLeft).toBe(this.scrollerElement.clientWidth);

                  simulant.fire(this.trackXElement, "click", {
                    which: 1,
                    clientY: topX,
                    clientX: leftX
                  });
                  simulant.fire(this.trackYElement, "click", {
                    which: 1,
                    clientY: topY,
                    clientX: leftY
                  });

                  setTimeout(() => {
                    expect(this.scrollerElement.scrollTop).toBe(0);
                    expect(this.scrollerElement.scrollLeft).toBe(0);

                    done();
                  }, 20);
                }, 20);
              }, 20);
            }, 20);
          }, 20);
        }
      );
    });

    it('[RTL] track click should cause `step` towards clicked position if `trackClickBehavior="step"`', done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={TRACK_CLICK_BEHAVIOR.STEP}
          style={{ width: 100, height: 100, position: "relative" }}
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            const {
              top: topX,
              height: heightX,
              left: leftX,
              width: widthX
            } = this.trackXElement.getBoundingClientRect();
            const {
              top: topY,
              height: heightY,
              left: leftY,
              width: widthY
            } = this.trackYElement.getBoundingClientRect();

            simulant.fire(this.trackXElement, "click", {
              which: 1,
              clientY: topX + heightX / 2,
              clientX: leftX + widthX / 2
            });
            simulant.fire(this.trackYElement, "click", {
              which: 1,
              clientY: topY + heightY / 2,
              clientX: leftY + widthY / 2
            });

            setTimeout(() => {
              expect(this.scrollerElement.scrollTop).toBe(this.scrollerElement.clientHeight);
              expect(this.scrollerElement.scrollLeft).toBe(this.scrollerElement.clientWidth);

              simulant.fire(this.trackXElement, "click", {
                which: 1,
                clientY: topX + heightX / 2,
                clientX: leftX + widthX / 2
              });
              simulant.fire(this.trackYElement, "click", {
                which: 1,
                clientY: topY + heightY / 2,
                clientX: leftY + widthY / 2
              });

              setTimeout(() => {
                expect(this.scrollerElement.scrollTop).toBe(2 * this.scrollerElement.clientHeight);
                expect(this.scrollerElement.scrollLeft).toBe(2 * this.scrollerElement.clientWidth);

                simulant.fire(this.trackXElement, "click", {
                  which: 1,
                  clientY: topX,
                  clientX: leftX
                });
                simulant.fire(this.trackYElement, "click", {
                  which: 1,
                  clientY: topY,
                  clientX: leftY
                });

                setTimeout(() => {
                  expect(this.scrollerElement.scrollTop).toBe(this.scrollerElement.clientHeight);
                  expect(this.scrollerElement.scrollLeft).toBe(this.scrollerElement.clientWidth);

                  simulant.fire(this.trackXElement, "click", {
                    which: 1,
                    clientY: topX,
                    clientX: leftX
                  });
                  simulant.fire(this.trackYElement, "click", {
                    which: 1,
                    clientY: topY,
                    clientX: leftY
                  });

                  setTimeout(() => {
                    expect(this.scrollerElement.scrollTop).toBe(0);
                    expect(this.scrollerElement.scrollLeft).toBe(0);

                    done();
                  }, 20);
                }, 20);
              }, 20);
            }, 20);
          }, 20);
        }
      );
    });
  });

  describe("thumb interaction", () => {
    it("should scroll on Y thumb drag", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 100, position: "relative" }}>
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            const {
              top: thumbTop,
              height: thumbHeight,
              left: thumbLeft,
              width: thumbWidth
            } = this.thumbYElement.getBoundingClientRect();

            const { height: trackHeight, width: trackWidth } = this.trackYElement.getBoundingClientRect();

            simulant.fire(this.thumbYElement, "mousedown", {
              button: 0,
              clientY: thumbTop + thumbHeight / 2,
              clientX: thumbLeft + thumbWidth / 2
            });

            setTimeout(() => {
              simulant.fire(document, "mousemove", {
                button: 0,
                clientY: thumbTop + trackHeight,
                clientX: thumbLeft + trackWidth
              });

              setTimeout(() => {
                simulant.fire(document, "mouseup", {
                  button: 0,
                  clientY: thumbTop + trackHeight,
                  clientX: thumbLeft + trackWidth
                });

                setTimeout(() => {
                  expect(this.scrollValues.scrollTop).toBe(
                    this.scrollValues.scrollHeight - this.scrollValues.clientHeight
                  );
                  expect(this.scrollValues.scrollLeft).toBe(0);
                  done();
                }, 20);
              }, 5);
            }, 5);
          }, 20);
        }
      );
    });

    it("should scroll on X thumb drag", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 100, position: "relative" }}>
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            const {
              top: thumbTop,
              height: thumbHeight,
              left: thumbLeft,
              width: thumbWidth
            } = this.thumbXElement.getBoundingClientRect();

            const { height: trackHeight, width: trackWidth } = this.trackXElement.getBoundingClientRect();

            simulant.fire(this.thumbXElement, "mousedown", {
              button: 0,
              clientY: thumbTop + thumbHeight / 2,
              clientX: thumbLeft + thumbWidth / 2
            });

            setTimeout(() => {
              simulant.fire(document, "mousemove", {
                button: 0,
                clientY: thumbTop + trackHeight,
                clientX: thumbLeft + trackWidth
              });

              setTimeout(() => {
                simulant.fire(document, "mouseup", {
                  button: 0,
                  clientY: thumbTop + trackHeight,
                  clientX: thumbLeft + trackWidth
                });

                setTimeout(() => {
                  expect(this.scrollValues.scrollLeft).toBe(
                    this.scrollValues.scrollWidth - this.scrollValues.clientWidth
                  );
                  expect(this.scrollValues.scrollTop).toBe(0);
                  done();
                }, 20);
              }, 5);
            }, 5);
          }, 20);
        }
      );
    });

    it("should scroll on X thumb drag while RTL", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 100, position: "relative" }} rtl>
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            const {
              top: thumbTop,
              height: thumbHeight,
              left: thumbLeft,
              width: thumbWidth
            } = this.thumbXElement.getBoundingClientRect();

            const { height: trackHeight, width: trackWidth } = this.trackXElement.getBoundingClientRect();

            simulant.fire(this.thumbXElement, "mousedown", {
              button: 0,
              clientY: thumbTop + thumbHeight / 2,
              clientX: thumbLeft + thumbWidth / 2
            });

            setTimeout(() => {
              simulant.fire(document, "mousemove", {
                button: 0,
                clientY: thumbTop + trackHeight,
                clientX: thumbLeft + trackWidth
              });

              setTimeout(() => {
                simulant.fire(document, "mouseup", {
                  button: 0,
                  clientY: thumbTop + trackHeight,
                  clientX: thumbLeft + trackWidth
                });

                setTimeout(() => {
                  expect(this.scrollValues.scrollLeft).toBe(
                    this.scrollValues.scrollWidth - this.scrollValues.clientWidth
                  );
                  expect(this.scrollValues.scrollTop).toBe(0);
                  done();
                }, 20);
              }, 5);
            }, 5);
          }, 20);
        }
      );
    });
  });
});
