import * as ReactDOM from "react-dom";
import * as React from "react";
import Scrollbar, {
  SCROLLBAR_TRACK_CLICK_BEHAVIOR,
  ScrollbarProps,
  ScrollbarState,
  ScrollValues
} from "./../src/Scrollbar";
import cnb from "cnbuilder";
import * as simulant from "simulant";

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
      <Scrollbar
        {...this.state.scrollbarProps}
        children={this.props.children}
        ref={ref => (this.scrollbar = ref)}
      />
    );
  }
}

describe("Scrollbar", () => {
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

  describe("render", () => {
    it("should render proper DOM structure", done => {
      ReactDOM.render(
        <Scrollbar style={{ width: 100, height: 100 }}>
          <div style={{ width: 200, height: 200 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(
              this.wrapperElement.parentNode === this.holderElement
            ).toBeTruthy();
            expect(
              this.contentElement.parentNode === this.wrapperElement
            ).toBeTruthy();
            expect(
              this.trackXElement.parentNode === this.holderElement
            ).toBeTruthy();
            expect(
              this.thumbXElement.parentNode === this.trackXElement
            ).toBeTruthy();
            expect(
              this.trackYElement.parentNode === this.holderElement
            ).toBeTruthy();
            expect(
              this.thumbYElement.parentNode === this.trackYElement
            ).toBeTruthy();

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
            expect(
              this.holderElement.classList.contains("ScrollbarsCustom")
            ).toBeTruthy();
            expect(
              this.holderElement.classList.contains("trackYVisible")
            ).toBeTruthy();
            expect(
              this.holderElement.classList.contains("trackXVisible")
            ).toBeTruthy();
            expect(this.holderElement.classList.contains("rtl")).toBeTruthy();
            expect(
              this.holderElement.classList.contains("customHolderClassname")
            ).toBeTruthy();

            expect(
              this.wrapperElement.classList.contains("ScrollbarWrapper")
            ).toBeTruthy();
            expect(
              this.wrapperElement.classList.contains("customWrapperClassName")
            ).toBeTruthy();

            expect(
              this.contentElement.classList.contains("ScrollbarContent")
            ).toBeTruthy();
            expect(
              this.contentElement.classList.contains("customContentClassName")
            ).toBeTruthy();

            expect(
              this.trackXElement.classList.contains("ScrollbarTrack")
            ).toBeTruthy();
            expect(
              this.trackXElement.classList.contains("ScrollbarTrack-X")
            ).toBeTruthy();
            expect(
              this.trackXElement.classList.contains("customTrackXClassName")
            ).toBeTruthy();

            expect(
              this.trackYElement.classList.contains("ScrollbarTrack")
            ).toBeTruthy();
            expect(
              this.trackYElement.classList.contains("ScrollbarTrack-Y")
            ).toBeTruthy();
            expect(
              this.trackYElement.classList.contains("customTrackYClassName")
            ).toBeTruthy();

            expect(
              this.thumbXElement.classList.contains("ScrollbarThumb")
            ).toBeTruthy();
            expect(
              this.thumbXElement.classList.contains("ScrollbarThumb-X")
            ).toBeTruthy();
            expect(
              this.thumbXElement.classList.contains("customThumbXClassName")
            ).toBeTruthy();

            expect(
              this.thumbYElement.classList.contains("ScrollbarThumb")
            ).toBeTruthy();
            expect(
              this.thumbYElement.classList.contains("ScrollbarThumb-Y")
            ).toBeTruthy();
            expect(
              this.thumbYElement.classList.contains("customThumbYClassName")
            ).toBeTruthy();

            done();
          }, 20);
        }
      );
    });

    it("should pass element references to elementRef props", done => {
      const holderRef = jasmine.createSpy();
      const wrapperRef = jasmine.createSpy();
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
            expect(contentRef).toHaveBeenCalled();
            expect(trackXRef).toHaveBeenCalled();
            expect(trackYRef).toHaveBeenCalled();
            expect(thumbXRef).toHaveBeenCalled();
            expect(thumbYRef).toHaveBeenCalled();

            expect(holderRef.calls.argsFor(0)[0]).toBe(this.holderElement);
            expect(wrapperRef.calls.argsFor(0)[0]).toBe(this.wrapperElement);
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
            expect(
              this.holderElement.classList.contains("ScrollbarsCustom")
            ).toBeTruthy();
            expect(
              this.holderElement.classList.contains("trackYVisible")
            ).toBeTruthy();
            expect(
              this.holderElement.classList.contains("trackXVisible")
            ).toBeTruthy();
            expect(
              this.holderElement.classList.contains("customHolderClassname")
            ).toBeTruthy();

            expect(this.wrapperElement.tagName).toBe("SPAN");
            expect(
              this.wrapperElement.classList.contains("ScrollbarWrapper")
            ).toBeTruthy();
            expect(
              this.wrapperElement.classList.contains("customWrapperClassName")
            ).toBeTruthy();

            expect(this.contentElement.tagName).toBe("SPAN");
            expect(
              this.contentElement.classList.contains("ScrollbarContent")
            ).toBeTruthy();
            expect(
              this.contentElement.classList.contains("customContentClassName")
            ).toBeTruthy();

            expect(this.trackXElement.tagName).toBe("SPAN");
            expect(
              this.trackXElement.classList.contains("ScrollbarTrack")
            ).toBeTruthy();
            expect(
              this.trackXElement.classList.contains("ScrollbarTrack-X")
            ).toBeTruthy();
            expect(
              this.trackXElement.classList.contains("customTrackXClassName")
            ).toBeTruthy();

            expect(this.trackYElement.tagName).toBe("SPAN");
            expect(
              this.trackYElement.classList.contains("ScrollbarTrack")
            ).toBeTruthy();
            expect(
              this.trackYElement.classList.contains("ScrollbarTrack-Y")
            ).toBeTruthy();
            expect(
              this.trackYElement.classList.contains("customTrackYClassName")
            ).toBeTruthy();

            expect(this.thumbXElement.tagName).toBe("SPAN");
            expect(
              this.thumbXElement.classList.contains("ScrollbarThumb")
            ).toBeTruthy();
            expect(
              this.thumbXElement.classList.contains("ScrollbarThumb-X")
            ).toBeTruthy();
            expect(
              this.thumbXElement.classList.contains("customThumbXClassName")
            ).toBeTruthy();

            expect(this.thumbYElement.tagName).toBe("SPAN");
            expect(
              this.thumbYElement.classList.contains("ScrollbarThumb")
            ).toBeTruthy();
            expect(
              this.thumbYElement.classList.contains("ScrollbarThumb-Y")
            ).toBeTruthy();
            expect(
              this.thumbYElement.classList.contains("customThumbYClassName")
            ).toBeTruthy();

            done();
          }, 20);
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
                "holder element was not created. Possibly you haven't provided HTMLElement to renderer's `elementRef` function."
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
                "wrapper element was not created. Possibly you haven't provided HTMLElement to renderer's `elementRef` function."
              );

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
                "content element was not created. Possibly you haven't provided HTMLElement to renderer's `elementRef` function."
              );

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
    it("should render a single content element with given classnames", done => {
      ReactDOM.render(
        <Scrollbar
          style={{ width: 100, height: 70 }}
          native
          rtl
          className="customHolderClassname"
        >
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

            expect(this.contentElement.__proto__.toString()).toBe(
              "[object HTMLDivElement]"
            );
            expect(
              this.contentElement.classList.contains("native")
            ).toBeTruthy();
            expect(this.contentElement.classList.contains("rtl")).toBeTruthy();
            expect(
              this.contentElement.classList.contains("trackYVisible")
            ).toBeTruthy();
            expect(
              this.contentElement.classList.contains("trackXVisible")
            ).toBeTruthy();
            expect(
              this.contentElement.classList.contains("ScrollbarsCustom")
            ).toBeTruthy();
            done();
          }, 30);
        }
      );
    });

    it("should apply props scroll values", done => {
      ReactDOM.render(
        <Scrollbar
          style={{ width: 100, height: 70 }}
          native
          scrollLeft={20}
          scrollTop={40}
        >
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.contentElement.scrollTop).toBe(40);
            expect(this.contentElement.scrollLeft).toBe(20);
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
          expect(this.contentElement.style.overflowX).toBe("hidden");
          expect(this.contentElement.style.overflowY).toBe("hidden");
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
          expect(this.contentElement.style.overflowX).toBe("hidden");
          expect(this.contentElement.style.overflowY).not.toBe("hidden");
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
          expect(this.contentElement.style.overflowX).not.toBe("hidden");
          expect(this.contentElement.style.overflowY).toBe("hidden");
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
          expect(this.contentElement.style.overflowX).toBe("scroll");
          expect(this.contentElement.style.overflowY).toBe("scroll");
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
          expect(this.contentElement.style.overflowX).toBe("scroll");
          expect(this.contentElement.style.overflowY).not.toBe("scroll");
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
          expect(this.contentElement.style.overflowX).not.toBe("scroll");
          expect(this.contentElement.style.overflowY).toBe("scroll");
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
              expect(this.contentElement.scrollLeft).toBe(800);

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
              expect(this.contentElement.scrollTop).toBe(900);

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
              expect(this.contentElement.scrollLeft).toBe(400);
              expect(this.contentElement.scrollTop).toBe(560);

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
              expect(this.contentElement.scrollLeft).toBe(350);
              expect(this.contentElement.scrollTop).toBe(510);

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
            expect(this.contentElement.scrollTop).toBe(450);

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
            expect(this.contentElement.scrollLeft).toBe(450);

            done();
          }
        );
      });
    });

    describe("in case of content element absence *just for LOC coverage*", () => {
      it("do nothing", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            //simulate weird behaviour
            this.contentElement = null;

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
          <Scrollbar
            style={{ width: 100, height: 100 }}
            scrollTop={450}
            scrollLeft={400}
            scrollbarWidth={17}
          >
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            setTimeout(() => {
              const scrollValues = this.getScrollValues();

              expect(scrollValues.clientHeight).toBe(92);
              expect(scrollValues.clientWidth).toBe(92);
              expect(scrollValues.scrollHeight).toBe(1000);
              expect(scrollValues.scrollWidth).toBe(900);
              expect(scrollValues.scrollTop).toBe(450);
              expect(scrollValues.scrollLeft).toBe(400);
              expect(scrollValues.scrollYBlocked).toBeFalsy();
              expect(scrollValues.scrollXBlocked).toBeFalsy();
              expect(scrollValues.scrollYPossible).toBeTruthy();
              expect(scrollValues.scrollXPossible).toBeTruthy();
              expect(scrollValues.trackYVisible).toBeTruthy();
              expect(scrollValues.trackXVisible).toBeTruthy();
              expect(scrollValues.isRTL).toBeFalsy();

              done();
            }, 30);
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
            this.contentElement.scrollTop = 450;

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
            this.contentElement.scrollLeft = 450;
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

    describe("in case of content element absence *just for LOC coverage*", () => {
      it("return 0", done => {
        ReactDOM.render(
          <Scrollbar style={{ width: 100, height: 100 }}>
            <div style={{ width: 900, height: 1000 }} />
          </Scrollbar>,
          node,
          function() {
            //simulate weird behaviour
            this.contentElement = null;

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
    it("should apply props scroll values", done => {
      ReactDOM.render(
        <Scrollbar
          style={{ width: 100, height: 70 }}
          scrollLeft={20}
          scrollTop={40}
        >
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.contentElement.scrollTop).toBe(40);
            expect(this.contentElement.scrollLeft).toBe(20);
            done();
          }, 30);
        }
      );
    });

    it("should apply fallback scrollbar width if scrollbarWidth is 0", done => {
      ReactDOM.render(
        <Scrollbar
          style={{ width: 100, height: 70 }}
          scrollbarWidth={0}
          fallbackScrollbarWidth={11}
        >
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.contentElement.style.marginRight).toBe("-11px");
            done();
          }, 30);
        }
      );
    });

    it("should apply props scroll values", done => {
      ReactDOM.render(
        <Scrollbar
          style={{ width: 100, height: 70 }}
          scrollLeft={20}
          scrollTop={40}
        >
          <div style={{ width: 200, height: 210 }} />
        </Scrollbar>,
        node,
        function() {
          setTimeout(() => {
            expect(this.contentElement.scrollTop).toBe(40);
            expect(this.contentElement.scrollLeft).toBe(20);
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
            expect(this.contentElement.style.overflowX).toBe("hidden");
            expect(this.contentElement.style.overflowY).toBe("hidden");
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
            expect(this.contentElement.style.overflowX).toBe("hidden");
            expect(this.contentElement.style.overflowY).not.toBe("hidden");
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
            expect(this.contentElement.style.overflowX).not.toBe("hidden");
            expect(this.contentElement.style.overflowY).toBe("hidden");
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
              expect(this.scrollbar.contentElement.scrollTop).toBe(20);
              expect(this.scrollbar.contentElement.scrollLeft).toBe(40);

              setScrollbarProps({
                style: { width: 100, height: 70 },
                scrollTop: 40,
                scrollLeft: 50
              });
              setTimeout(() => {
                expect(this.scrollbar.contentElement.scrollTop).toBe(40);
                expect(this.scrollbar.contentElement.scrollLeft).toBe(50);

                setScrollbarProps({ style: { width: 100, height: 70 } });
                setTimeout(() => {
                  expect(this.scrollbar.contentElement.scrollTop).toBe(40);
                  expect(this.scrollbar.contentElement.scrollLeft).toBe(50);

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
              expect(this.scrollbar.contentElement.style.overflowX).toBe(
                "hidden"
              );
              expect(this.scrollbar.contentElement.style.overflowY).toBe(
                "hidden"
              );

              setScrollbarProps({
                style: { width: 100, height: 70 },
                noScrollX: true
              });
              setTimeout(() => {
                expect(this.scrollbar.contentElement.style.overflowX).toBe(
                  "hidden"
                );
                expect(this.scrollbar.contentElement.style.overflowY).not.toBe(
                  "hidden"
                );

                setScrollbarProps({
                  style: { width: 100, height: 70 },
                  noScrollY: true
                });
                setTimeout(() => {
                  expect(
                    this.scrollbar.contentElement.style.overflowX
                  ).not.toBe("hidden");
                  expect(this.scrollbar.contentElement.style.overflowY).toBe(
                    "hidden"
                  );

                  setScrollbarProps({ style: { width: 100, height: 70 } });
                  setTimeout(() => {
                    expect(
                      this.scrollbar.contentElement.style.overflowX
                    ).not.toBe("hidden");
                    expect(
                      this.scrollbar.contentElement.style.overflowY
                    ).not.toBe("hidden");

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
              expect(this.scrollbar.trackXElement.style.display).not.toBe(
                "none"
              );
              expect(this.scrollbar.trackYElement.style.display).not.toBe(
                "none"
              );

              setScrollbarProps({
                style: { width: 100, height: 70 },
                noScroll: true,
                permanentTrackX: true
              });
              setTimeout(() => {
                expect(this.scrollbar.trackXElement.style.display).not.toBe(
                  "none"
                );
                expect(this.scrollbar.trackYElement.style.display).toBe("none");

                setScrollbarProps({
                  style: { width: 100, height: 70 },
                  noScroll: true,
                  permanentTrackY: true
                });
                setTimeout(() => {
                  expect(this.scrollbar.trackXElement.style.display).toBe(
                    "none"
                  );
                  expect(this.scrollbar.trackYElement.style.display).not.toBe(
                    "none"
                  );

                  setScrollbarProps({
                    style: { width: 100, height: 70 },
                    noScroll: true
                  });
                  setTimeout(() => {
                    expect(this.scrollbar.trackXElement.style.display).toBe(
                      "none"
                    );
                    expect(this.scrollbar.trackYElement.style.display).toBe(
                      "none"
                    );

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
        trackYProps: {},
        trackXProps: {},
        thumbXProps: {},
        thumbYProps: {}
      };
      const state: ScrollbarState = {
        trackYVisible: true,
        trackXVisible: true
      };
      const scrollValues: ScrollValues = {
        clientHeight: 0,
        clientWidth: 0,
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
          scrollValues,
          17
        );

        expect(result.content.direction).toBe("rtl");
        expect(result.wrapper.left).toBe(8);

        result = Scrollbar.calculateStyles(
          {
            ...props,
            rtl: false
          },
          {
            ...state,
            isRTL: false
          },
          scrollValues,
          17
        );
        expect(result.content.direction).toBe("ltr");
        expect(result.wrapper.right).toBe(8);

        result = Scrollbar.calculateStyles(
          {
            ...props,
            rtl: undefined
          },
          {
            ...state,
            isRTL: false
          },
          scrollValues,
          17
        );
        expect(result.content.direction).toBe(undefined);
        expect(result.wrapper.right).toBe(8);
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
          scrollValues,
          0
        );

        expect(result.content.paddingBottom).toBe(20);
        expect(result.content.paddingLeft).toBe(20);
        expect(result.content.paddingRight).toBe(undefined);
        expect(result.content.marginLeft).toBe(-20);
        expect(result.content.marginRight).toBe(undefined);

        result = Scrollbar.calculateStyles(
          {
            ...props,
            fallbackScrollbarWidth: 20
          },
          {
            ...state,
            isRTL: false
          },
          scrollValues,
          0
        );

        expect(result.content.paddingBottom).toBe(20);
        expect(result.content.paddingRight).toBe(20);
        expect(result.content.paddingLeft).toBe(undefined);
        expect(result.content.marginRight).toBe(-20);
        expect(result.content.marginLeft).toBe(undefined);

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
            ...scrollValues,
            scrollYPossible: false
          },
          0
        );

        expect(result.content.paddingLeft).toBe(undefined);
        expect(result.content.marginLeft).toBe(undefined);
      });
    });
  });

  describe("callbacks", () => {
    it("should call an onScroll only if scroll has changed", done => {
      let setScrollbarProps;
      let spy = jasmine.createSpy();

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
          trackClickBehavior={SCROLLBAR_TRACK_CLICK_BEHAVIOR.JUMP}
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
          trackClickBehavior={SCROLLBAR_TRACK_CLICK_BEHAVIOR.JUMP}
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
            expect(this.contentElement.scrollTop).toBe(120);
            expect(this.contentElement.scrollLeft).toBe(100);

            done();
          }, 20);
        }
      );
    });

    it("should not perform a scroll while mousewheel over tracks and scrolling is diabled", done => {
      ReactDOM.render(
        <Scrollbar
          trackClickBehavior={SCROLLBAR_TRACK_CLICK_BEHAVIOR.JUMP}
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
          trackClickBehavior={SCROLLBAR_TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
          noScroll
        >
          <div style={{ width: 1000, height: 1000 }} />
        </Scrollbar>,
        node,
        function() {
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
          trackClickBehavior={SCROLLBAR_TRACK_CLICK_BEHAVIOR.JUMP}
          style={{ width: 100, height: 100, position: "relative" }}
          scrollbarWidth={17}
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
              expect(this.contentElement.scrollTop).toBe(
                (this.contentElement.scrollHeight -
                  this.contentElement.clientHeight) /
                  2
              );
              expect(this.contentElement.scrollLeft).toBe(
                (this.contentElement.scrollWidth -
                  this.contentElement.clientWidth) /
                  2
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
          trackClickBehavior={SCROLLBAR_TRACK_CLICK_BEHAVIOR.STEP}
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
              expect(this.contentElement.scrollTop).toBe(
                this.contentElement.clientHeight
              );
              expect(this.contentElement.scrollLeft).toBe(
                this.contentElement.clientWidth
              );

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
                expect(this.contentElement.scrollTop).toBe(
                  2 * this.contentElement.clientHeight
                );
                expect(this.contentElement.scrollLeft).toBe(
                  2 * this.contentElement.clientWidth
                );

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
                  expect(this.contentElement.scrollTop).toBe(
                    this.contentElement.clientHeight
                  );
                  expect(this.contentElement.scrollLeft).toBe(
                    this.contentElement.clientWidth
                  );

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
                    expect(this.contentElement.scrollTop).toBe(0);
                    expect(this.contentElement.scrollLeft).toBe(0);

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
});
