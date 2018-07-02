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
        tagName:               PropTypes.string,
        className:             PropTypes.string,
        defaultStyles:         PropTypes.bool,
        renderView:            PropTypes.func,
        renderTrackVertical:   PropTypes.func,
        renderTrackHorizontal: PropTypes.func,
        renderThumbVertical:   PropTypes.func,
        renderThumbHorizontal: PropTypes.func,
        thumbSizeMin:          PropTypes.number,
        onScroll:              PropTypes.func,
        onScrollStart:         PropTypes.func,
        onScrollStop:          PropTypes.func,
        children:              PropTypes.node,
    };

    static defaultProps = {
        tagName:               'div',
        className:             'CustomScrollbar-wrapper',
        defaultStyles:         true,
        thumbSizeMin:          30,
        renderView:            defaultElementRender.scroller,
        renderTrackVertical:   defaultElementRender.trackVertical,
        renderTrackHorizontal: defaultElementRender.trackHorizontal,
        renderThumbVertical:   defaultElementRender.thumbVertical,
        renderThumbHorizontal: defaultElementRender.thumbHorizontal,
    };

    constructor(props, ...rest) {
        super(props, ...rest);

        this.handleScrollEvent = this.handleScrollEvent.bind(this);
    }

    componentWillUnmount() {
        this.removeListeners();
        raf.cancel(this.requestFrame);
    }

    componentDidMount() {
        this.addListeners();
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    getScrollValues() {
        const {
                  scrollLeft   = 0,
                  scrollTop    = 0,
                  scrollWidth  = 0,
                  scrollHeight = 0,
                  clientWidth  = 0,
                  clientHeight = 0,
              } = this.scroller || {};

        return {
            left: (scrollLeft / (scrollWidth - clientWidth)) || 0,
            top:  (scrollTop / (scrollHeight - clientHeight)) || 0,
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight,
        };
    }

    raf(cb) {
        if (isset(this.requestFrame)) {raf.cancel(this.requestFrame);}

        this.requestFrame = raf(() => {
            this.requestFrame = undefined;
            cb();
        });
    }

    addListeners() {
        if (!isset(document) || !this.scroller) {
            return;
        }

        const {scroller, trackVertical, trackHorizontal, thumbVertical, thumbHorizontal} = this;

        scroller.addEventListener('scroll', this.handleScrollEvent);
    }

    removeListeners() {
        if (!isset(document) || !this.scroller) {
            return;
        }

        const {scroller, trackVertical, trackHorizontal, thumbVertical, thumbHorizontal} = this;

        scroller.removeEventListener('scroll', this.handleScrollEvent);
    }

    handleScrollEvent() {
        this.update((values) => {
            const {scrollLeft, scrollTop} = values;

            this.scrollLeft = scrollLeft;
            this.scrollTop = scrollTop;
        });

        this.detectScroll();
    }

    detectScroll() {
        if (this.scrolling) { return; }

        this.scrolling = true;
        if (isFunction(this.props.onScrollStart)) {
            this.props.onScrollStart();
        }

        this.detectScrollInterval = setInterval(() => {
                                                    if (this.lastScrollLeft === this.scrollLeft && this.lastScrollTop === this.scrollTop) {
                                                        clearInterval(this.detectScrollInterval);
                                                        this.scrolling = false;

                                                        if (isFunction(this.props.onScrollStart)) {
                                                            this.props.onScrollStop();
                                                        }
                                                    }

                                                    this.lastScrollLeft = this.scrollLeft;
                                                    this.lastScrollTop = this.scrollTop;
                                                },
                                                100);
    }

    update(cb) {
        this.raf(() => this.actualizeScrollbars(cb));
    }

    computeThumbVerticalHeight(trackHeight) {
        const {scrollHeight, clientHeight} = this.scroller;
        const {thumbSizeMin} = this.props;
        const height = Math.ceil(clientHeight / scrollHeight * trackHeight);

        return trackHeight === height ? 0 : Math.max(height, thumbSizeMin);
    }

    computeThumbHorizontalWidth(trackWidth) {
        const {scrollWidth, clientWidth} = this.scroller;
        const {thumbSizeMin} = this.props;
        const width = Math.ceil(scrollWidth / clientWidth * trackWidth);

        return trackWidth === width ? 0 : Math.max(width, thumbSizeMin);
    }

    actualizeScrollbars(cb) {
        const scrollValues = this.getScrollValues();
        const {scrollLeft, scrollTop, clientWidth, scrollWidth, clientHeight, scrollHeight} = scrollValues;

        const trackHorizontalInnerWidth = getInnerWigth(this.trackHorizontal),
              trackVerticalInnerHeight  = getInnerHeight(this.trackVertical);

        const thumbHorizontalWidth = this.computeThumbHorizontalWidth(trackHorizontalInnerWidth),
              thumbVerticalHeight  = this.computeThumbVerticalHeight(trackVerticalInnerHeight);

        const thumbHorizontalOffset = thumbHorizontalWidth ? scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalInnerWidth - thumbHorizontalWidth) : 0,
              thumbVerticalOffset   = thumbVerticalHeight ? scrollTop / (scrollHeight - clientHeight) * (trackVerticalInnerHeight - thumbVerticalHeight) : 0;

        this.thumbHorizontal.style['transform'] = `translateX(${thumbHorizontalOffset}px)`;
        this.thumbHorizontal.style['width'] = thumbHorizontalWidth + 'px';

        this.thumbVertical.style['transform'] = `translateY(${thumbVerticalOffset}px)`;
        this.thumbVertical.style['height'] = thumbVerticalHeight + 'px';

        if (isFunction(cb)) {
            cb(scrollValues);
        }
    }

    render() {
        const {
                  tagName, thumbSizeMin, children, defaultStyles, style,
                  renderView, renderTrackVertical, renderTrackHorizontal, renderThumbVertical, renderThumbHorizontal,
                  ...props
              } = this.props;

        const browserScrollbarWidth = getScrollbarWidth(),
              wrapperStyle          = {...style, ...(defaultStyles && defaultElementStyles.wrapper)},
              scrollerStyle         = {...(defaultStyles && defaultElementStyles.scroller), marginRight: -browserScrollbarWidth, marginBottom: -browserScrollbarWidth},
              trackVerticalStyle    = {...(defaultStyles && defaultElementStyles.trackVertical)},
              thumbVerticalStyle    = {...(defaultStyles && defaultElementStyles.thumbVertical)},
              trackHorizontalStyle  = {...(defaultStyles && defaultElementStyles.trackHorizontal)},
              thumbHorizontalStyle  = {...(defaultStyles && defaultElementStyles.thumbHorizontal)};

        return createElement(
                tagName,
                {...props, style: wrapperStyle, ref: (ref) => {this.wrapper = ref;}},
                [
                    renderView({
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