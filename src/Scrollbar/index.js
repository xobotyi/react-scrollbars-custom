import PropTypes                                from "prop-types";
import raf                                      from 'raf';
import { Component, createElement }             from 'react';
import { getInnerHeight, getInnerWigth }        from '../util/getInnerSizes';
import { getScrollbarWidth, isFunction, isset } from '../util/utilities';
import * as defaultElementRender                from "./defaultElementRender";
import * as defaultElementStyles                from "./defaultElementStyle";

export default class Scrollbar extends Component
{
    static propTypes = {
        thumbSizeMin:                 PropTypes.number,
        scrollDetectionThreshold:     PropTypes.number,
        defaultStyles:                PropTypes.bool,
        permanentScrollbars:          PropTypes.bool,
        permanentScrollbarVertical:   PropTypes.bool,
        permanentScrollbarHorizontal: PropTypes.bool,

        onScroll:      PropTypes.func,
        onScrollStart: PropTypes.func,
        onScrollStop:  PropTypes.func,

        tagName:               PropTypes.string,
        className:             PropTypes.string,
        renderScroller:        PropTypes.func,
        renderTrackVertical:   PropTypes.func,
        renderTrackHorizontal: PropTypes.func,
        renderThumbVertical:   PropTypes.func,
        renderThumbHorizontal: PropTypes.func,
        children:              PropTypes.node,
    };

    static defaultProps = {
        defaultStyles:                true,
        thumbSizeMin:                 30,
        scrollDetectionThreshold:     100,
        permanentScrollbars:          false,
        permanentScrollbarVertical:   false,
        permanentScrollbarHorizontal: false,

        tagName:               'div',
        className:             'CustomScrollbar-wrapper',
        renderScroller:        defaultElementRender.scroller,
        renderTrackVertical:   defaultElementRender.trackVertical,
        renderTrackHorizontal: defaultElementRender.trackHorizontal,
        renderThumbVertical:   defaultElementRender.thumbVertical,
        renderThumbHorizontal: defaultElementRender.thumbHorizontal,
    };

    //==============//
    //   bindings   //
    //==============//
    constructor(props, ...rest) {
        super(props, ...rest);

        // event handlers has to be hard binded to current instance
        this.handleScrollEvent = this.handleScrollEvent.bind(this);
        this.handleWindowResizeEvent = this.handleWindowResizeEvent.bind(this);
        this.handleTrackVerticalMousedownEvent = this.handleTrackVerticalMousedownEvent.bind(this);
        this.handleTrackHorizontalMousedownEvent = this.handleTrackHorizontalMousedownEvent.bind(this);
        this.handleThumbVerticalMousedownEvent = this.handleThumbVerticalMousedownEvent.bind(this);
        this.handleThumbHorizontalMousedownEvent = this.handleThumbHorizontalMousedownEvent.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDragEvent = this.handleDragEvent.bind(this);
    }

    componentWillUnmount() {
        this.handleDragEnd();
        this.removeListeners();

        raf.cancel(this.requestFrame);
        clearInterval(this.scrollDetect.interval);
    }

    componentDidMount() {
        this.addListeners();
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    addListeners() {
        if (!isset(document) || !this.scroller) { return; }

        const {scroller, trackVertical, trackHorizontal, thumbVertical, thumbHorizontal} = this;

        window.addEventListener('resize', this.handleWindowResizeEvent, {passive: true});
        scroller.addEventListener('scroll', this.handleScrollEvent, {passive: true});
        trackVertical.addEventListener('mousedown', this.handleTrackVerticalMousedownEvent);
        trackHorizontal.addEventListener('mousedown', this.handleTrackHorizontalMousedownEvent);
        thumbVertical.addEventListener('mousedown', this.handleThumbVerticalMousedownEvent);
        thumbHorizontal.addEventListener('mousedown', this.handleThumbHorizontalMousedownEvent);
    }

    removeListeners() {
        if (!isset(document) || !this.scroller) { return; }

        const {scroller, trackVertical, trackHorizontal, thumbVertical, thumbHorizontal} = this;

        window.removeEventListener('resize', this.handleWindowResizeEvent);
        scroller.removeEventListener('scroll', this.handleScrollEvent);
        trackVertical.removeEventListener('mousedown', this.handleTrackVerticalMousedownEvent);
        trackHorizontal.removeEventListener('mousedown', this.handleTrackHorizontalMousedownEvent);
        thumbVertical.removeEventListener('mousedown', this.handleThumbVerticalMousedownEvent);
        thumbHorizontal.removeEventListener('mousedown', this.handleThumbHorizontalMousedownEvent);
    }

    //==============//
    //     api      //
    //==============//
    /**
     * Set the vertical scroll to given amount of pixels
     *
     * @param top {number} Pixels amount
     */
    set scrollTop(top) {
        if (!this.scroller) { return; }

        this.scroller.scrollTop = top;
    }

    /**
     * Return the vertical scroll position
     *
     * @return {number}
     */
    get scrollTop() {
        if (!this.scroller) { return 0; }

        return this.scroller.scrollTop;
    }

    /**
     * Set the horizontal scroll to given amount of pixels
     *
     * @param left {number} Pixels amount
     */
    set scrollLeft(left) {
        if (!this.scroller) { return; }

        this.scroller.scrollLeft = left;
    }

    /**
     * Return the horizontal scroll position
     *
     * @return {number}
     */
    get scrollLeft() {
        if (!this.scroller) { return 0; }

        this.scroller.scrollLeft = left;
    }

    /**
     * @return {number}
     */
    get scrolHeight() {
        if (!this.scroller) { return 0; }

        return this.scroller.scrolHeight;
    }

    /**
     * @return {number}
     */
    get scrolWidth() {
        if (!this.scroller) {
            return 0;
        }
        return this.scroller.scrolWidth;
    }

    /**
     * @return {number}
     */
    get clientHeight() {
        if (!this.scroller) { return 0; }

        return this.scroller.clientHeight;
    }

    /**
     * @return {number}
     */
    get clientWidth() {
        if (!this.scroller) { return 0; }

        return this.scroller.clientWidth;
    }

    /**
     * Scrol to the top border
     *
     * @return {Scrollbar}
     */
    scrollToTop() {
        if (!this.scroller) {
            return this;
        }
        this.scroller.scrollTop = 0;

        return this;
    }

    /**
     * Scroll to the bottom brder
     *
     * @return {Scrollbar}
     */
    scrollToBotoom() {
        if (!this.scroller) { return this; }
        this.scroller.scrollTop = this.scroller.scrollHeight;

        return this;
    }

    /**
     * Scrolls to the left border
     *
     * @return {Scrollbar}
     */
    scrollToLeft() {
        if (!this.scroller) { return this; }
        this.scroller.scrollLeft = 0;

        return this;
    }

    /**
     * Scroll to the right border
     *
     * @return {Scrollbar}
     */
    scrollToRight() {
        if (!this.scroller) { return this; }
        this.scroller.scrollLeft = this.scroller.scrollWidth;

        return this;
    }

    //==============//
    //   handlers   //
    //==============//
    handleScrollEvent(e) {
        this.update((values) => {
            if (isFunction(this.props.onScroll)) { this.props.onScroll({...values, event: e}); }
        });

        this.scrollDetect();
    }

    scrollDetect() {
        if (this.scrolling) { return; }

        this.scrolling = true;

        if (isFunction(this.props.onScrollStart)) { this.props.onScrollStart(this.getScrollValues()); }

        this.scrollDetect.interval = setInterval(() => {
            if (this.scrollDetect.lastScrollTop === this.scroller.scrollTop && this.scrollDetect.lastScrollLeft === this.scroller.scrollLeft && !this.drag) {
                clearInterval(this.scrollDetect.interval);
                this.scrolling = false;

                if (isFunction(this.props.onScrollStop)) { this.props.onScrollStop(this.getScrollValues()); }
            }

            this.scrollDetect.lastScrollTop = this.scroller.scrollTop;
            this.scrollDetect.lastScrollLeft = this.scroller.scrollLeft;
        }, this.props.scrollDetectionThreshold);
    }

    handleWindowResizeEvent() {
        this.update();
    }

    handleTrackVerticalMousedownEvent(e) {
        if (e.which !== 1) {return;}
        e.preventDefault();

        const offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY) - this.thumbVertical.clientHeight / 2;

        this.scroller.scrollTop = this.computeScrollTopForThumbOffset(offset);
    }

    handleTrackHorizontalMousedownEvent(e) {
        if (e.which !== 1) {return;}
        e.preventDefault();

        const offset = Math.abs(e.target.getBoundingClientRect().left - e.clientX) - this.thumbHorizontal.clientWidth / 2;

        this.scroller.scrollLeft = this.computeScrollLeftForThumbOffset(offset);
    }

    handleThumbVerticalMousedownEvent(e) {
        if (e.which !== 1) {return;}
        e.preventDefault();
        e.stopImmediatePropagation();

        this.handleDragStart();

        const {target, clientY} = e;
        this.dragPrevPageY = target.clientHeight - (clientY - target.getBoundingClientRect().top);
        this.thumbVertical.classList.add('dragging');
    }

    handleThumbHorizontalMousedownEvent(e) {
        if (e.which !== 1) {return;}
        e.preventDefault();
        e.stopImmediatePropagation();

        this.handleDragStart();

        const {target, clientX} = e;
        this.dragPrevPageX = target.clientWidth - (clientX - target.getBoundingClientRect().left);
        this.thumbHorizontal.classList.add('dragging');
    }

    handleDragStart() {
        this.drag = true;
        this.scrollDetect();

        document.addEventListener('mousemove', this.handleDragEvent);
        document.addEventListener('mouseup', this.handleDragEnd);

        document.body.style.userSelect = 'none';
        document.onselectstart = () => false;
    }

    handleDragEnd() {
        this.drag = false;
        this.dragPrevPageX = this.dragPrevPageY = 0;

        document.removeEventListener('mousemove', this.handleDragEvent);
        document.removeEventListener('mouseup', this.handleDragEnd);

        document.body.style.userSelect = null;
        document.onselectstart = undefined;

        this.thumbHorizontal.classList.remove('dragging');
        this.thumbVertical.classList.remove('dragging');
    }

    handleDragEvent(e) {
        if (this.dragPrevPageX) {
            const offset = -this.trackHorizontal.getBoundingClientRect().left + e.clientX - (this.thumbHorizontal.clientWidth - this.dragPrevPageX);
            this.scroller.scrollLeft = this.computeScrollLeftForThumbOffset(offset);
        }
        if (this.dragPrevPageY) {
            const offset = -this.trackVertical.getBoundingClientRect().top + e.clientY - (this.thumbVertical.clientHeight - this.dragPrevPageY);
            this.scroller.scrollTop = this.computeScrollTopForThumbOffset(offset);
        }
    }

    //================//
    //   assistance   //
    //================//
    /**
     * Return scroller measures + percentage scroll positions
     *
     * @return {{left: number, top: number, scrollLeft: number, scrollTop: number, scrollWidth: number, scrollHeight: number, clientWidth: number, clientHeight: number}}
     */
    getScrollValues() {
        const {scrollLeft = 0, scrollTop = 0, scrollWidth = 0, scrollHeight = 0, clientWidth = 0, clientHeight = 0} = this.scroller || {};

        this.scrollValues = {
            left: (scrollLeft / (scrollWidth - clientWidth)) || 0,
            top:  (scrollTop / (scrollHeight - clientHeight)) || 0,
            scrollTop,
            scrollLeft,
            scrollHeight,
            scrollWidth,
            clientWidth,
            clientHeight,
        };

        return this.scrollValues;
    }

    /**
     * Request animation frame and call given function inside
     *
     * @param cb {function} Function to call in reqiested frame
     */
    raf(cb) {
        if (isset(this.requestFrame)) {raf.cancel(this.requestFrame);}

        this.requestFrame = raf(() => {
            this.requestFrame = undefined;
            cb();
        });
    }

    /**
     * Request animation frame and actualize the scrollbars
     *
     * @param cb {function|undefined} The function to call after actualisation
     */
    update(cb = undefined) {
        this.raf(() => this.actualizeScrollbars(cb));
    }

    /**
     * Returns vertical thumb height corresponding viewport height to scrollable content height ratio
     *
     * @param trackHeight {number} Height of track where thumb placed
     * @return {number}
     */
    computeThumbVerticalHeight(trackHeight) {
        const {scrollHeight, clientHeight} = this.scroller;
        const {thumbSizeMin} = this.props;
        const height = Math.ceil(clientHeight / scrollHeight * trackHeight);

        return trackHeight === height ? 0 : Math.max(height, thumbSizeMin);
    }

    /**
     * Returns scroller's scrollTop value corresponding given thumb offset
     *
     * @param offset {number} Thumb's offset top, in pixels
     * @return {number}
     */
    computeScrollTopForThumbOffset(offset) {
        const {clientHeight, scrollHeight} = this.scroller;
        const trackVerticalInnerHeight = getInnerHeight(this.trackVertical);
        const thumbVerticalHeight = this.thumbVertical.clientHeight;

        return offset / (trackVerticalInnerHeight - thumbVerticalHeight) * (scrollHeight - clientHeight);
    }

    /**
     * Returns horizontal thumb width corresponding viewport width to scrollable content width ratio
     *
     * @param trackWidth {number} Width of track where thumb placed
     * @return {number}
     */
    computeThumbHorizontalWidth(trackWidth) {
        const {scrollWidth, clientWidth} = this.scroller;
        const {thumbSizeMin} = this.props;
        const width = Math.ceil(scrollWidth / clientWidth * trackWidth);

        return trackWidth === width ? 0 : Math.max(width, thumbSizeMin);
    }

    /**
     * Returns scroller's scrollLeft value corresponding given thumb offset
     *
     * @param offset {number} Thumb's offset left, in pixels
     * @return {number}
     */
    computeScrollLeftForThumbOffset(offset) {
        const {clientWidth, scrollWidth} = this.scroller;
        const trackHorizontalInnerWidth = getInnerWigth(this.trackHorizontal);
        const thumbHorizontalWidth = this.thumbHorizontal.clientWidth;

        return offset / (trackHorizontalInnerWidth - thumbHorizontalWidth) * (scrollWidth - clientWidth);
    }

    /**
     * Actualizes scrollbars visibility and thumbs sizes and positions
     *
     * @param cb {function|undefined} The function to call after actualisation
     */
    actualizeScrollbars(cb = undefined) {
        const scrollValues = this.getScrollValues();
        const {scrollLeft, scrollTop, clientWidth, scrollWidth, clientHeight, scrollHeight} = scrollValues;

        const trackHorizontalInnerWidth = getInnerWigth(this.trackHorizontal),
              trackVerticalInnerHeight  = getInnerHeight(this.trackVertical);

        const thumbHorizontalWidth = this.computeThumbHorizontalWidth(trackHorizontalInnerWidth),
              thumbVerticalHeight  = this.computeThumbVerticalHeight(trackVerticalInnerHeight);

        const thumbHorizontalOffset = thumbHorizontalWidth ? scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalInnerWidth - thumbHorizontalWidth) : 0,
              thumbVerticalOffset   = thumbVerticalHeight ? scrollTop / (scrollHeight - clientHeight) * (trackVerticalInnerHeight - thumbVerticalHeight) : 0;

        if (!this.props.permanentScrollbars && !this.props.permanentScrollbarVertical) {
            this.trackVertical.style.display = thumbVerticalHeight ? null : 'none';
        }
        this.thumbVertical.style.transform = `translateY(${thumbVerticalOffset}px)`;
        this.thumbVertical.style.height = thumbVerticalHeight + 'px';

        if (!this.props.permanentScrollbars && !this.props.permanentScrollbarHorizontal) {
            this.trackHorizontal.style.display = thumbHorizontalWidth ? null : 'none';
        }
        this.thumbHorizontal.style.transform = `translateX(${thumbHorizontalOffset}px)`;
        this.thumbHorizontal.style.width = thumbHorizontalWidth + 'px';

        if (isFunction(cb)) {
            cb(scrollValues);
        }
    }

    render() {
        const {
                  style, thumbSizeMin, defaultStyles, scrollDetectionThreshold, permanentScrollbars, permanentScrollbarVertical, permanentScrollbarHorizontal,
                  tagName, children, renderScroller, renderTrackVertical, renderTrackHorizontal, renderThumbVertical, renderThumbHorizontal,
                  onScroll, onScrollStart, onScrollStop,
                  ...props
              } = this.props;

        const browserScrollbarWidth = getScrollbarWidth(),
              wrapperStyle          = {...style, ...defaultElementStyles.wrapper},
              scrollerStyle         = {...defaultElementStyles.scroller, marginRight: -browserScrollbarWidth, marginBottom: -browserScrollbarWidth},
              trackVerticalStyle    = {...(defaultStyles && defaultElementStyles.trackVertical), ...(!browserScrollbarWidth && {display: 'none'})},
              thumbVerticalStyle    = {...(defaultStyles && defaultElementStyles.thumbVertical)},
              trackHorizontalStyle  = {...(defaultStyles && defaultElementStyles.trackHorizontal), ...(!browserScrollbarWidth && {display: 'none'})},
              thumbHorizontalStyle  = {...(defaultStyles && defaultElementStyles.thumbHorizontal)};

        return createElement(
                tagName,
                {...props, style: wrapperStyle, ref: (ref) => {this.wrapper = ref;}},
                [
                    renderScroller({
                                       key:   'scroller',
                                       style: scrollerStyle,
                                       ref:   (ref) => {this.scroller = ref;},
                                       children,
                                   }),
                    renderTrackVertical({
                                            key:      'trackVertical',
                                            style:    trackVerticalStyle,
                                            ref:      (ref) => {this.trackVertical = ref;},
                                            children: renderThumbVertical({
                                                                              key:   'thumbVertical',
                                                                              style: thumbVerticalStyle,
                                                                              ref:   (ref) => {this.thumbVertical = ref;},
                                                                          }),
                                        }),
                    renderTrackHorizontal({
                                              key:      'trackHorizontal',
                                              style:    trackHorizontalStyle,
                                              ref:      (ref) => {this.trackHorizontal = ref;},
                                              children: renderThumbHorizontal({
                                                                                  key:   'thumbHorizontal',
                                                                                  style: thumbHorizontalStyle,
                                                                                  ref:   (ref) => {this.thumbHorizontal = ref;},
                                                                              }),
                                          }),
                ],
        );
    }
}