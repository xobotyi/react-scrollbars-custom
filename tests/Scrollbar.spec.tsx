import {render, unmountComponentAtNode} from "react-dom";
import * as  React from "react";
import Scrollbar, {ScrollbarProps, ScrollbarState, ScrollValues} from "./../src/Scrollbar";
import {dbgSetScrollbarWidth} from "../src/getScrollbarWidth";

describe("Scrollbar", () => {
    let node: HTMLDivElement;
    beforeAll(() => {
        node = document.createElement('div');
        document.body.appendChild(node);
        dbgSetScrollbarWidth(null);
    });
    afterEach(() => {
        unmountComponentAtNode(node);
        dbgSetScrollbarWidth(null);
    });
    afterAll(() => {
        unmountComponentAtNode(node);
        document.body.removeChild(node);
        dbgSetScrollbarWidth(null);
    });

    describe("render", () => {
        it("should render proper DOM structure", (done) => {
            render((
                       <Scrollbar style={{width: 100, height: 100}}>
                           <div style={{width: 200, height: 200}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       setTimeout(() => {
                           expect(this.wrapperEl.parentNode === this.holderEl).toBeTruthy();
                           expect(this.contentEl.parentNode === this.wrapperEl).toBeTruthy();
                           expect(this.trackXEl.parentNode === this.holderEl).toBeTruthy();
                           expect(this.thumbXEl.parentNode === this.trackXEl).toBeTruthy();
                           expect(this.trackYEl.parentNode === this.holderEl).toBeTruthy();
                           expect(this.thumbYEl.parentNode === this.trackYEl).toBeTruthy();

                           done();
                       }, 20);
                   });
        });

        it("should apply classnames", (done) => {
            render((
                       <Scrollbar style={{width: 100, height: 70}}
                                  rtl
                                  className="customHolderClassname"
                                  wrapperProps={{className: "customWrapperClassName"}}
                                  contentProps={{className: "customContentClassName"}}
                                  trackXProps={{className: "customTrackXClassName"}}
                                  trackYProps={{className: "customTrackYClassName"}}
                                  thumbXProps={{className: "customThumbXClassName"}}
                                  thumbYProps={{className: "customThumbYClassName"}}>
                           <div style={{width: 200, height: 210}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       setTimeout(() => {
                           expect(this.holderEl.classList.contains("ScrollbarsCustom")).toBeTruthy();
                           expect(this.holderEl.classList.contains("trackYVisible")).toBeTruthy();
                           expect(this.holderEl.classList.contains("trackXVisible")).toBeTruthy();
                           expect(this.holderEl.classList.contains("rtl")).toBeTruthy();
                           expect(this.holderEl.classList.contains("customHolderClassname")).toBeTruthy();

                           expect(this.wrapperEl.classList.contains("wrapper")).toBeTruthy();
                           expect(this.wrapperEl.classList.contains("customWrapperClassName")).toBeTruthy();

                           expect(this.contentEl.classList.contains("content")).toBeTruthy();
                           expect(this.contentEl.classList.contains("customContentClassName")).toBeTruthy();

                           expect(this.trackXEl.classList.contains("track")).toBeTruthy();
                           expect(this.trackXEl.classList.contains("trackX")).toBeTruthy();
                           expect(this.trackXEl.classList.contains("customTrackXClassName")).toBeTruthy();

                           expect(this.trackYEl.classList.contains("track")).toBeTruthy();
                           expect(this.trackYEl.classList.contains("trackY")).toBeTruthy();
                           expect(this.trackYEl.classList.contains("customTrackYClassName")).toBeTruthy();

                           expect(this.thumbXEl.classList.contains("thumb")).toBeTruthy();
                           expect(this.thumbXEl.classList.contains("thumbX")).toBeTruthy();
                           expect(this.thumbXEl.classList.contains("customThumbXClassName")).toBeTruthy();

                           expect(this.thumbYEl.classList.contains("thumb")).toBeTruthy();
                           expect(this.thumbYEl.classList.contains("thumbY")).toBeTruthy();
                           expect(this.thumbYEl.classList.contains("customThumbYClassName")).toBeTruthy();

                           done();
                       }, 20);
                   });
        });
    });

    describe("props", () => {
        it("should apply props scroll values", (done) => {
            render((
                       <Scrollbar style={{width: 100, height: 70}}
                                  scrollLeft={20}
                                  scrollTop={40}>
                           <div style={{width: 200, height: 210}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       setTimeout(() => {
                           expect(this.contentEl.scrollTop).toBe(40);
                           expect(this.contentEl.scrollLeft).toBe(20);
                           done();
                       }, 30);
                   });
        });

        it("should apply fallback scrollbar width iv browser's is 0", (done) => {
            dbgSetScrollbarWidth(0);
            render((
                       <Scrollbar style={{width: 100, height: 70}}
                                  fallbackScrollbarWidth={11}>
                           <div style={{width: 200, height: 210}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       setTimeout(() => {
                           expect(this.contentEl.style.marginRight).toBe("-11px");
                           done();
                       }, 30);
                   });
        });
    });

    describe("native", () => {
        it("should render a single content element with given classnames", (done) => {
            render((
                       <Scrollbar style={{width: 100, height: 70}}
                                  native
                                  rtl
                                  className="customHolderClassname">
                           <div style={{width: 200, height: 210}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       setTimeout(() => {
                           expect(this.wrapperEl).toBe(undefined);
                           expect(this.trackXEl).toBe(undefined);
                           expect(this.thumbXEl).toBe(undefined);
                           expect(this.trackYEl).toBe(undefined);
                           expect(this.thumbYEl).toBe(undefined);

                           expect(this.contentEl.__proto__.toString()).toBe("[object HTMLDivElement]");
                           expect(this.contentEl.classList.contains("native")).toBeTruthy();
                           expect(this.contentEl.classList.contains("trackYVisible")).toBeTruthy();
                           expect(this.contentEl.classList.contains("trackXVisible")).toBeTruthy();
                           expect(this.contentEl.classList.contains("ScrollbarsCustom")).toBeTruthy();
                           done();
                       }, 30);
                   });
        });

        it("should apply props scroll values", (done) => {
            render((
                       <Scrollbar style={{width: 100, height: 70}}
                                  native
                                  scrollLeft={20}
                                  scrollTop={40}>
                           <div style={{width: 200, height: 210}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       setTimeout(() => {
                           expect(this.contentEl.scrollTop).toBe(40);
                           expect(this.contentEl.scrollLeft).toBe(20);
                           done();
                       }, 30);
                   });
        });
    });

    describe("scroll setters", () => {
        describe(".scrollToRight()", () => {
            it("should scroll to the right content's border", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.scrollToRight();

                           setTimeout(() => {
                               expect(this.scrollValues.scrollLeft).toBe(800);

                               done();
                           }, 20);
                       });
            });
        });
        describe(".scrollToLeft()", () => {
            it("should scroll to the left content's border", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.scrollToRight();
                           this.scrollToLeft();

                           setTimeout(() => {
                               expect(this.scrollValues.scrollLeft).toBe(0);

                               done();
                           }, 20);
                       });
            });
        });
        describe(".scrollToBottom()", () => {
            it("should scroll to the bottom content's border", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.scrollToBottom();

                           setTimeout(() => {
                               expect(this.scrollValues.scrollTop).toBe(900);

                               done();
                           }, 20);
                       });
            });
        });
        describe(".scrollToTop()", () => {
            it("should scroll to the top content's border", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.scrollToBottom();
                           this.scrollToTop();

                           setTimeout(() => {
                               expect(this.scrollValues.scrollTop).toBe(0);

                               done();
                           }, 20);
                       });
            });
        });
        describe(".scrollTo(x,y)", () => {
            it("should set left top viewport's corner at given coordinates ", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.scrollTo(400, 560);

                           setTimeout(() => {
                               expect(this.scrollValues.scrollLeft).toBe(400);
                               expect(this.scrollValues.scrollTop).toBe(560);

                               done();
                           }, 20);
                       });
            });
        });
        describe(".centerAt(x,y)", () => {
            it("should center the viewport at given coordinates ", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.centerAt(400, 560);

                           setTimeout(() => {
                               expect(this.scrollValues.scrollLeft).toBe(350);
                               expect(this.scrollValues.scrollTop).toBe(510);

                               done();
                           }, 20);
                       });
            });
        });
        describe(".scrollTop", () => {
            it("should set the content's scrollTop position", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.scrollTop = 450;
                           expect(this.contentEl.scrollTop).toBe(450);

                           done();
                       });
            });
        });
        describe(".scrollLeft", () => {
            it("should set the content's scrollTop position", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.scrollLeft = 450;
                           expect(this.contentEl.scrollLeft).toBe(450);

                           done();
                       });
            });
        });

        describe("in case of content element absence *just for LOC coverage*", () => {
            it("do nothing", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           //simulate weird behaviour
                           this.contentEl = null;

                           this.scrollLeft = 100;
                           this.scrollTop  = 100;
                           this.scrollToRight();
                           this.scrollToLeft();
                           this.scrollToTop();
                           this.scrollToBottom();
                           this.scrollTo(1, 2);
                           this.centerAt(1, 2);

                           done();
                       });
            });
        });
    });

    describe("scroll getters", () => {
        describe(".scrollValues", () => {
            it("should return proper values", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}
                                      scrollTop={450}
                                      scrollLeft={400}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           setTimeout(() => {
                               const scrollValues = this.scrollValues;

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
                           }, 20);
                       });
            });
        });

        describe(".scrollTop", () => {
            it("should return proper value", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.contentEl.scrollTop = 450;

                           expect(this.scrollTop).toBe(450);

                           done();
                       });
            });
        });

        describe(".scrollLeft", () => {
            it("should return proper value", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           this.contentEl.scrollLeft = 450;
                           expect(this.scrollLeft).toBe(450);

                           done();
                       });
            });
        });

        describe(".scrollHeight", () => {
            it("should return proper value", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           expect(this.scrollHeight).toBe(1000);

                           done();
                       });
            });
        });

        describe(".scrollWidth", () => {
            it("should return proper value", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           expect(this.scrollWidth).toBe(900);

                           done();
                       });
            });
        });

        describe(".clientHeight", () => {
            it("should return proper value", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 200}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           expect(this.clientHeight).toBe(200);

                           done();
                       });
            });
        });

        describe(".clientWidth", () => {
            it("should return proper value", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 200}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           expect(this.clientWidth).toBe(100);

                           done();
                       });
            });
        });

        describe("in case of content element absence *just for LOC coverage*", () => {
            it("return 0", (done) => {
                render((
                           <Scrollbar style={{width: 100, height: 100}}>
                               <div style={{width: 900, height: 1000}} />
                           </Scrollbar>
                       ),
                       node,
                       function () {
                           //simulate weird behaviour
                           this.contentEl = null;

                           expect(this.scrollLeft).toBe(0);
                           expect(this.scrollTop).toBe(0);
                           expect(this.clientHeight).toBe(0);
                           expect(this.clientWidth).toBe(0);
                           expect(this.scrollHeight).toBe(0);
                           expect(this.scrollWidth).toBe(0);

                           done();
                       });
            });
        });
    });

    describe("element references should be passed to respective function", () => {
        it('holder ref', (done) => {
            let element;

            render((
                       <Scrollbar elementRef={ref => element = ref} />
                   ),
                   node,
                   function () {
                       expect(element).toBe(this.holderEl);

                       done();
                   });
        });

        it('wrapper ref', (done) => {
            let element;

            render((
                       <Scrollbar wrapperProps={{elementRef: ref => element = ref}} />
                   ),
                   node,
                   function () {
                       expect(element).toBe(this.wrapperEl);

                       done();
                   });
        });

        it('content ref', (done) => {
            let element;

            render((
                       <Scrollbar contentProps={{elementRef: ref => element = ref}} />
                   ),
                   node,
                   function () {
                       expect(element).toBe(this.contentEl);

                       done();
                   });
        });

        it('trackX ref', (done) => {
            let element;

            render((
                       <Scrollbar trackXProps={{elementRef: ref => element = ref}} style={{width: 100, height: 100}}>
                           <div style={{width: 900, height: 1000}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       expect(element).toBe(this.trackXEl);

                       done();
                   });
        });
        it('thumbX ref', (done) => {
            let element;

            render((
                       <Scrollbar thumbXProps={{elementRef: ref => element = ref}} style={{width: 100, height: 100}}>
                           <div style={{width: 900, height: 1000}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       expect(element).toBe(this.thumbXEl);

                       done();
                   });
        });

        it('trackY ref', (done) => {
            let element;

            render((
                       <Scrollbar trackYProps={{elementRef: ref => element = ref}} style={{width: 100, height: 100}}>
                           <div style={{width: 900, height: 1000}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       expect(element).toBe(this.trackXEl);

                       done();
                   });
        });
        it('thumbY ref', (done) => {
            let element;

            render((
                       <Scrollbar thumbYProps={{elementRef: ref => element = ref}} style={{width: 100, height: 100}}>
                           <div style={{width: 900, height: 1000}} />
                       </Scrollbar>
                   ),
                   node,
                   function () {
                       expect(element).toBe(this.thumbYEl);

                       done();
                   });
        });
    });

    describe("static methods", () => {
        it(".calculateThumbSize()", () => {
            expect(Scrollbar.calculateThumbSize(100, 100, 100, 30)).toBe(0);
            expect(Scrollbar.calculateThumbSize(100, 100, 1000, 30)).toBe(30);
            expect(Scrollbar.calculateThumbSize(100, 100, 200, 30)).toBe(50);
        });

        it(".calculateThumbOffset()", () => {
            expect(Scrollbar.calculateThumbOffset(100, 20, 100, 900, 500)).toBe(50);
            expect(Scrollbar.calculateThumbOffset(100, 40, 100, 500, 500)).toBe(75);
            expect(Scrollbar.calculateThumbOffset(100, 20, 100, 100, 500)).toBe(0);
            expect(Scrollbar.calculateThumbOffset(100, 0, 100, 900, 500)).toBe(0);
        });

        it(".calculateScrollForThumbOffset()", () => {
            expect(Scrollbar.calculateScrollForThumbOffset(100, 20, 100, 900, 50)).toBe(500);
            expect(Scrollbar.calculateScrollForThumbOffset(100, 40, 100, 500, 75)).toBe(500);
            expect(Scrollbar.calculateScrollForThumbOffset(100, 20, 100, 900, 0)).toBe(0);
            expect(Scrollbar.calculateScrollForThumbOffset(100, 20, 100, 50, 150)).toBe(0);
            expect(Scrollbar.calculateScrollForThumbOffset(100, 0, 100, 50, 150)).toBe(0);
        });

        describe(".calculateStyles()", () => {
            const props: ScrollbarProps      = {};
            const state: ScrollbarState      = {
                trackYVisible: true,
                trackXVisible: true,
            };
            const scrollValues: ScrollValues = {
                clientHeight: null,
                clientWidth: null,
                scrollHeight: null,
                scrollWidth: null,
                scrollTop: null,
                scrollLeft: null,
                scrollYBlocked: false,
                scrollXBlocked: false,
                scrollYPossible: true,
                scrollXPossible: true,
                trackYVisible: true,
                trackXVisible: true,
                isRTL: undefined,
            };

            it("should return proper rtl styles", () => {
                let result = Scrollbar.calculateStyles({
                                                           ...props,
                                                           rtl: true,
                                                       },
                                                       {
                                                           ...state,
                                                           isRTL: true,
                                                       },
                                                       scrollValues,
                                                       17,
                                                       17);

                expect(result.holder.direction).toBe("rtl");
                expect(result.wrapper.marginLeft).toBe(8);

                result = Scrollbar.calculateStyles({
                                                       ...props,
                                                       rtl: false,
                                                   },
                                                   {
                                                       ...state,
                                                       isRTL: false,
                                                   },
                                                   scrollValues,
                                                   17,
                                                   17);
                expect(result.holder.direction).toBe("ltr");
                expect(result.wrapper.marginRight).toBe(8);

                result = Scrollbar.calculateStyles({
                                                       ...props,
                                                       rtl: undefined,
                                                   },
                                                   {
                                                       ...state,
                                                       isRTL: false,
                                                   },
                                                   scrollValues,
                                                   17,
                                                   17);
                expect(result.holder.direction).toBe(undefined);
                expect(result.wrapper.marginRight).toBe(8);
            });

            it("should return proper content paddings for mobile browsers", () => {
                let result = Scrollbar.calculateStyles({
                                                           ...props,
                                                           rtl: true,
                                                       },
                                                       {
                                                           ...state,
                                                           isRTL: true,
                                                       },
                                                       scrollValues,
                                                       0,
                                                       17);

                expect(result.content.paddingBottom).toBe(17);
                expect(result.content.paddingLeft).toBe(17);
                expect(result.content.paddingRight).toBe(undefined);
                expect(result.content.marginLeft).toBe(-17);
                expect(result.content.marginRight).toBe(undefined);

                result = Scrollbar.calculateStyles({
                                                       ...props,
                                                   },
                                                   {
                                                       ...state,
                                                       isRTL: false,
                                                   },
                                                   scrollValues,
                                                   0,
                                                   17);

                expect(result.content.paddingBottom).toBe(17);
                expect(result.content.paddingRight).toBe(17);
                expect(result.content.paddingLeft).toBe(undefined);
                expect(result.content.marginRight).toBe(-17);
                expect(result.content.marginLeft).toBe(undefined);

                result = Scrollbar.calculateStyles({
                                                       ...props,
                                                   },
                                                   {
                                                       ...state,
                                                       isRTL: true,
                                                   },
                                                   {
                                                       ...scrollValues,
                                                       scrollYPossible: false,
                                                   },
                                                   0,
                                                   17);

                expect(result.content.paddingLeft).toBe(undefined);
                expect(result.content.marginLeft).toBe(undefined);
            });
        });
    });
});
