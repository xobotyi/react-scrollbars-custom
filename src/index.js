import PropTypes from "prop-types";
import React from "react";
import NativeScrollbar from "./NativeScrollbar";
import Thumb from "./Thumb";
import Track, {TYPE_X, TYPE_Y} from "./Track";
import {getInnerHeight, getInnerWidth} from "./util/getInnerSizes";
import getScrollbarWidth from "./util/getScrollbarWidth";
import LoopController from "./util/LoopController";

const defaultStyles = {
    holder: {
        position: "relative",
        display: "flex",
    },
    wrapper: {
        flexGrow: 1,
    },
    content: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    track: {
        common: {
            position: "absolute",
            overflow: "hidden",
            borderRadius: 4,
            background: "rgba(0,0,0,.1)",
            userSelect: "none",
        },
        x: {
            height: 8,
            width: "calc(100% - 16px)",
            bottom: 0,
            left: 8,
        },
        y: {
            width: 8,
            height: "calc(100% - 16px)",
            top: 8,
        },
    },
    thumb: {
        common: {
            cursor: "pointer",
            borderRadius: 4,
            background: "rgba(0,0,0,.4)",
        },
        x: {
            height: "100%",
        },
        y: {
            width: "100%",
        },
    },
};

/**
 * @typedef {object} ScrollValues
 *
 * @property {number|null} clientHeight - content's native clientHeight parameter
 * @property {number|null} clientWidth - content's native clientWidth parameter
 * @property {number|null} scrollHeight - content's native scrollHeight parameter
 * @property {number|null} scrollWidth - content's native scrollWidth parameter
 * @property {number|null} scrollTop - content's native scrollTop parameter
 * @property {number|null} scrollLeft - content's native scrollLeft parameter
 * @property {boolean|null} scrollYBlocked - Indicates whether vertical scroll blocked via properties
 * @property {boolean|null} scrollXBlocked - Indicates whether horizontal scroll blocked via properties
 * @property {boolean|null} scrollYPossible - Indicates whether the content overflows vertically and scrolling not blocked
 * @property {boolean|null} scrollXPossible - Indicates whether the content overflows horizontally and scrolling not blocked
 * @property {boolean|null} trackYVisible - Indicates whether vertical track is visible
 * @property {boolean|null} trackXVisible - Indicates whether horizontal track is visible
 * @property {boolean|null} isRtl - Indicates whether display direction is right-to-left
 */

export default class Scrollbar extends React.Component {
    static propTypes = {
        native: PropTypes.bool,

        minimalThumbsSize: PropTypes.number,

        fallbackScrollbarWidth: PropTypes.number,

        tagName: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,

        trackClickBehavior: PropTypes.oneOf(["jump", "step"]),

        rtl: PropTypes.bool,

        momentum: PropTypes.bool,

        noDefaultStyles: PropTypes.bool,

        scrollDetectionThreshold: PropTypes.number,

        translateContentSizesToHolder: PropTypes.bool,

        noScrollX: PropTypes.bool,
        noScrollY: PropTypes.bool,
        noScroll: PropTypes.bool,

        removeTracksWhenNotUsed: PropTypes.bool,
        removeTrackYWhenNotUsed: PropTypes.bool,
        removeTrackXWhenNotUsed: PropTypes.bool,

        permanentTrackX: PropTypes.bool,
        permanentTrackY: PropTypes.bool,
        permanentTracks: PropTypes.bool,

        wrapperProps: PropTypes.object,
        contentProps: PropTypes.object,
        trackXProps: PropTypes.object,
        trackYProps: PropTypes.object,
        thumbXProps: PropTypes.object,
        thumbYProps: PropTypes.object,

        wrapperRenderer: PropTypes.func,
        contentRenderer: PropTypes.func,
        trackXRenderer: PropTypes.func,
        trackYRenderer: PropTypes.func,
        thumbXRenderer: PropTypes.func,
        thumbYRenderer: PropTypes.func,

        onScroll: PropTypes.func,
        onScrollStart: PropTypes.func,
        onScrollStop: PropTypes.func,
    };

    static defaultProps = {
        native: false,

        tagName: "div",

        minimalThumbsSize: 30,

        fallbackScrollbarWidth: 20,

        trackClickBehavior: "jump",

        momentum: true,

        noDefaultStyles: false,

        scrollDetectionThreshold: 100,

        translateContentSizesToHolder: false,

        noScrollX: false,
        noScrollY: false,
        noScroll: false,

        permanentTrackX: false,
        permanentTrackY: false,
        permanentTracks: false,

        removeTracksWhenNotUsed: true,
        removeTrackYWhenNotUsed: true,
        removeTrackXWhenNotUsed: true,

        wrapperProps: {},
        contentProps: {},
        trackXProps: {},
        trackYProps: {},
        thumbXProps: {},
        thumbYProps: {},
    };

    /**
     * Compute the thumb size
     *
     * @param {number} trackSize
     * @param {number} scrollableSize
     * @param {number} viewportSize
     * @param {number} minimalSize
     * @return {number}
     */
    static computeThumbSize(trackSize, scrollableSize, viewportSize, minimalSize) {
        const size = Math.ceil((viewportSize / scrollableSize) * trackSize) || 0;

        return trackSize === size ? 0 : Math.max(size, minimalSize);
    }

    /**
     * Compute the thumb offset from scroll value
     *
     * @param {number} trackSize
     * @param {number} thumbSize
     * @param {number} scrollableSize
     * @param {number} viewportSize
     * @param {number} scrollValue
     * @return {number}
     */
    static computeThumbOffset(trackSize, thumbSize, scrollableSize, viewportSize, scrollValue) {
        return (thumbSize && (scrollValue / (scrollableSize - viewportSize)) * (trackSize - thumbSize)) || 0;
    }

    /**
     * Compute the scroll value depending on thumb offset
     *
     * @param {number} trackSize
     * @param {number} thumbSize
     * @param {number} offset
     * @param {number} scrollableSize
     * @param {number} viewportSize
     * @return {number}
     */
    static computeScrollForOffset(trackSize, thumbSize, offset, scrollableSize, viewportSize) {
        return ((offset - thumbSize / 2) / (trackSize - thumbSize)) * (scrollableSize - viewportSize) || 0;
    }

    constructor(props) {
        super(props);

        this.state = {
            trackYVisible: true,
            trackXVisible: true,
            isRtl: this.props.rtl,
        };

        this.scrollValues = this.getScrollValues(true);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.rtl !== prevProps.rtl && this.props.rtl !== this.state.isRtl) {
            this.setState({isRtl: this.props.rtl});
        }

        if (this.state.isRtl !== prevState.isRtl) {
            this.update();
        }
    }

    componentDidMount() {
        LoopController.registerScrollbar(this);

        this.contentEl.addEventListener("scroll", this.handleScrollEvent, {
            passive: true,
        });

        this.update();
    }

    componentWillUnmount() {
        LoopController.unregisterScrollbar(this);

        this.contentEl.removeEventListener("scroll", this.handleScrollEvent, {
            passive: true,
        });
    }

    handleScrollEvent = () => {
        this.scrollDetect();
    };

    scrollDetect = () => {
        if (!this.props.onScrollStart && !this.props.onScrollStop) {
            return;
        }

        !this.scrollDetect.timeout &&
            this.props.onScrollStart &&
            this.props.onScrollStart.call(this, this.getScrollValues());

        this.scrollDetect.timeout && clearTimeout(this.scrollDetect.timeout);

        this.scrollDetect.timeout = setTimeout(() => {
            this.scrollDetect.timeout = null;
            this.props.onScrollStop && this.props.onScrollStop.call(this, this.getScrollValues());
        }, this.props.scrollDetectionThreshold);
    };

    /**
     * Return the vertical scroll position
     *
     * @return {number}
     */
    get scrollTop() {
        if (this.contentEl) {
            return this.contentEl.scrollTop;
        }

        return 0;
    }

    /**
     *
     * Set the vertical scroll to given amount of pixels
     *
     * @param top {number} Pixels amount
     */
    set scrollTop(top) {
        if (this.contentEl) {
            this.contentEl.scrollTop = top;
            this.update();
        }
    }

    /**
     * Return the horizontal scroll position
     *
     * @return {number}
     */
    get scrollLeft() {
        if (this.contentEl) {
            return this.contentEl.scrollLeft;
        }

        return 0;
    }

    /**
     * Set the horizontal scroll to given amount of pixels
     *
     * @param left {number} Pixels amount
     */
    set scrollLeft(left) {
        if (this.contentEl) {
            this.contentEl.scrollLeft = left;
        }
    }

    /**
     * @return {number}
     */
    get scrollHeight() {
        if (this.contentEl) {
            return this.contentEl.scrollHeight;
        }

        return 0;
    }

    /**
     * @return {number}
     */
    get scrollWidth() {
        if (this.contentEl) {
            return this.contentEl.scrollWidth;
        }

        return 0;
    }

    /**
     * @return {number}
     */
    get clientHeight() {
        if (this.contentEl) {
            return this.contentEl.clientHeight;
        }

        return 0;
    }

    /**
     * @return {number}
     */
    get clientWidth() {
        if (this.contentEl) {
            return this.contentEl.clientWidth;
        }

        return 0;
    }

    /**
     * Scrol to the top border
     *
     * @return {Scrollbar}
     */
    scrollToTop() {
        if (this.contentEl) {
            this.contentEl.scrollTop = 0;
        }

        return this;
    }

    /**
     * Scroll to the bottom border
     *
     * @return {Scrollbar}
     */
    scrollToBottom() {
        if (this.contentEl) {
            this.contentEl.scrollTop = this.contentEl.scrollHeight;
        }

        return this;
    }

    /**
     * Scrolls to the left border
     *
     * @return {Scrollbar}
     */
    scrollToLeft() {
        if (this.contentEl) {
            this.contentEl.scrollLeft = 0;
        }

        return this;
    }

    /**
     * Scroll to the right border
     *
     * @return {Scrollbar}
     */
    scrollToRight() {
        if (this.contentEl) {
            this.contentEl.scrollLeft = this.contentEl.scrollWidth;
        }

        return this;
    }

    /**
     * @param {boolean} force
     *
     * @return {ScrollValues}
     */
    getScrollValues(force = false) {
        if (!force) {
            return this.scrollValues;
        }

        const scrollValues = {
            clientHeight: null,
            clientWidth: null,
            scrollHeight: null,
            scrollWidth: null,
            scrollTop: null,
            scrollLeft: null,
            scrollYBlocked: null,
            scrollXBlocked: null,
            scrollYPossible: null,
            scrollXPossible: null,
            trackYVisible: null,
            trackXVisible: null,
            isRtl: null,
        };

        if (this.contentEl) {
            scrollValues.clientHeight = this.contentEl.clientHeight;
            scrollValues.clientWidth = this.contentEl.clientWidth;
            scrollValues.scrollHeight = this.contentEl.scrollHeight;
            scrollValues.scrollWidth = this.contentEl.scrollWidth;
            scrollValues.scrollTop = this.contentEl.scrollTop;
            scrollValues.scrollLeft = this.contentEl.scrollLeft;
            scrollValues.scrollYBlocked = this.props.noScroll || this.props.noScrollY;
            scrollValues.scrollXBlocked = this.props.noScroll || this.props.noScrollX;
            scrollValues.scrollYPossible =
                !scrollValues.scrollYBlocked && scrollValues.scrollHeight > scrollValues.clientHeight;
            scrollValues.scrollXPossible =
                !scrollValues.scrollXBlocked && scrollValues.scrollWidth > scrollValues.clientWidth;
            scrollValues.trackYVisible =
                scrollValues.scrollYPossible || this.props.permanentTracks || this.props.permanentTrackY;
            scrollValues.trackXVisible =
                scrollValues.scrollXPossible || this.props.permanentTracks || this.props.permanentTrackX;
            scrollValues.isRtl = this.state.isRtl;
        }

        return scrollValues;
    }

    /**
     *
     * @param forced
     * @return {ScrollValues}
     */
    update = (forced = false) => {
        // autodetect direction if not defined
        if (typeof this.state.isRtl !== "boolean") {
            this.setState({isRtl: getComputedStyle(this.contentEl).direction === "rtl"});

            return this.getScrollValues();
        }

        const scrollValues = this.getScrollValues(true),
            prevScrollValues = this.getScrollValues();

        let bitmask = 0;

        // calculating bitmask
        prevScrollValues.clientHeight !== scrollValues.clientHeight && (bitmask |= 1 << 0);
        prevScrollValues.clientWidth !== scrollValues.clientWidth && (bitmask |= 1 << 1);
        prevScrollValues.scrollHeight !== scrollValues.scrollHeight && (bitmask |= 1 << 2);
        prevScrollValues.scrollWidth !== scrollValues.scrollWidth && (bitmask |= 1 << 3);
        prevScrollValues.scrollTop !== scrollValues.scrollTop && (bitmask |= 1 << 4);
        prevScrollValues.scrollLeft !== scrollValues.scrollLeft && (bitmask |= 1 << 5);
        prevScrollValues.scrollYBlocked !== scrollValues.scrollYBlocked && (bitmask |= 1 << 6);
        prevScrollValues.scrollXBlocked !== scrollValues.scrollXBlocked && (bitmask |= 1 << 7);
        prevScrollValues.scrollYPossible !== scrollValues.scrollYPossible && (bitmask |= 1 << 8);
        prevScrollValues.scrollXPossible !== scrollValues.scrollXPossible && (bitmask |= 1 << 9);
        prevScrollValues.trackYVisible !== scrollValues.trackYVisible && (bitmask |= 1 << 10);
        prevScrollValues.trackXVisible !== scrollValues.trackXVisible && (bitmask |= 1 << 11);
        prevScrollValues.isRtl !== scrollValues.isRtl && (bitmask |= 1 << 12);

        // if not forced and nothing has changed - skip this step
        if (bitmask === 0 && !forced) {
            return prevScrollValues;
        }

        // if updater return true - call callbacks and cache the scroll values
        if (
            (this.props.native ? this.updaterNative : this.updaterCustom).call(
                this,
                scrollValues,
                prevScrollValues,
                bitmask
            )
        ) {
            this.scrollValues = scrollValues;
            prevScrollValues.scrollTop !== null &&
                this.props.onScroll &&
                this.props.onScroll(scrollValues, prevScrollValues);
        }

        return prevScrollValues;
    };

    /**
     * @param {ScrollValues} scrollValues current scroll values
     * @param {ScrollValues} prevScrollValues scroll values that been before the update process
     * @param {number} bitmask bit mask that represents difference between prev scroll values and current ones
     *
     * @return {boolean} whether to save current scroll values or not
     */
    updaterCustom(scrollValues, prevScrollValues, bitmask) {
        // if scrollbars visibility has changed
        if (bitmask & (1 << 10) || bitmask & (1 << 11)) {
            this.scrollValues.scrollYBlocked = scrollValues.scrollYBlocked;
            this.scrollValues.scrollXBlocked = scrollValues.scrollXBlocked;
            this.scrollValues.scrollYPossible = scrollValues.scrollYPossible;
            this.scrollValues.scrollXPossible = scrollValues.scrollXPossible;

            this.setState({
                trackYVisible: (this.scrollValues.trackYVisible = scrollValues.trackYVisible),
                trackXVisible: (this.scrollValues.trackXVisible = scrollValues.trackXVisible),
            });

            return false;
        }

        // if Y track rendered and changed anything related to scrollY
        if (this.trackYEl) {
            bitmask & (1 << 10) && (this.trackYEl.style.display = scrollValues.trackYVisible ? null : "none");

            if (
                bitmask & (1 << 0) ||
                bitmask & (1 << 2) ||
                bitmask & (1 << 4) ||
                bitmask & (1 << 6) ||
                bitmask & (1 << 8)
            ) {
                if (scrollValues.scrollYPossible) {
                    const trackSize = getInnerHeight(this.trackYEl);
                    const thumbSize = Scrollbar.computeThumbSize(
                        trackSize,
                        scrollValues.scrollHeight,
                        scrollValues.clientHeight,
                        this.props.minimalThumbsSize
                    );
                    const thumbOffset = Scrollbar.computeThumbOffset(
                        trackSize,
                        thumbSize,
                        scrollValues.scrollHeight,
                        scrollValues.clientHeight,
                        scrollValues.scrollTop
                    );

                    this.thumbYEl.style.transform = `translateY(${thumbOffset}px)`;
                    this.thumbYEl.style.height = thumbSize + "px";
                    this.thumbYEl.style.display = null;
                } else {
                    this.thumbYEl.style.transform = null;
                    this.thumbYEl.style.height = "0px";
                    this.thumbYEl.style.display = "none";
                }
            }
        }

        // if X track rendered and changed anything related to scrollX
        if (this.trackXEl) {
            bitmask & (1 << 11) && (this.trackXEl.style.display = scrollValues.trackXVisible ? null : "none");

            if (
                bitmask & (1 << 1) ||
                bitmask & (1 << 3) ||
                bitmask & (1 << 5) ||
                bitmask & (1 << 7) ||
                bitmask & (1 << 9)
            ) {
                if (scrollValues.scrollXPossible) {
                    const trackSize = getInnerWidth(this.trackXEl);
                    const thumbSize = Scrollbar.computeThumbSize(
                        trackSize,
                        scrollValues.scrollWidth,
                        scrollValues.clientWidth,
                        this.props.minimalThumbsSize
                    );
                    let thumbOffset = Scrollbar.computeThumbOffset(
                        trackSize,
                        thumbSize,
                        scrollValues.scrollWidth,
                        scrollValues.clientWidth,
                        scrollValues.scrollLeft
                    );

                    if (this.state.isRtl) {
                        thumbOffset = thumbSize + thumbOffset - trackSize;
                    }

                    this.thumbXEl.style.transform = `translateX(${thumbOffset}px)`;
                    this.thumbXEl.style.width = thumbSize + "px";
                    this.thumbXEl.style.display = null;
                } else {
                    this.thumbXEl.style.transform = null;
                    this.thumbXEl.style.width = "0px";
                    this.thumbXEl.style.display = "none";
                }
            }
        }

        if (this.props.translateContentSizesToHolder && this.holderEl && (bitmask & (1 << 2) || bitmask & (1 << 3))) {
            this.holderEl.style.width = scrollValues.scrollWidth + "px";
            this.holderEl.style.height = scrollValues.scrollHeight + "px";
        }

        return true;
    }

    /**
     * @param {ScrollValues} scrollValues current scroll values
     * @param {ScrollValues} prevScrollValues scroll values that been before the update process
     *
     * @param {number} bitmask bit mask that represents difference between prev scroll values and current ones
     */
    updaterNative(scrollValues, prevScrollValues, bitmask) {
        return true;
    }

    handleTrackClick = (e, params) => {
        params.axis === TYPE_X && this.props.trackXProps.onClick && this.props.trackXProps.onClick(e, params);
        params.axis === TYPE_Y && this.props.trackYProps.onClick && this.props.trackYProps.onClick(e, params);

        const scrollTarget =
            params.axis === TYPE_X
                ? Scrollbar.computeScrollForOffset(
                      getInnerWidth(this.trackXEl),
                      this.thumbXEl.clientWidth,
                      params.offset,
                      this.contentEl.scrollWidth,
                      this.contentEl.clientWidth
                  )
                : Scrollbar.computeScrollForOffset(
                      getInnerHeight(this.trackYEl),
                      this.thumbYEl.clientHeight,
                      params.offset,
                      this.contentEl.scrollHeight,
                      this.contentEl.clientHeight
                  );

        if (this.props.trackClickBehavior === "jump") {
            params.axis === TYPE_X && (this.contentEl.scrollLeft = scrollTarget);
            params.axis === TYPE_Y && (this.contentEl.scrollTop = scrollTarget);
        } else if (this.props.trackClickBehavior === "step") {
            params.axis === TYPE_X &&
                (this.contentEl.scrollLeft =
                    this.contentEl.scrollLeft < scrollTarget
                        ? this.contentEl.scrollLeft + this.contentEl.clientWidth
                        : this.contentEl.scrollLeft - this.contentEl.clientWidth);
            params.axis === TYPE_Y &&
                (this.contentEl.scrollTop =
                    this.contentEl.scrollTop < scrollTarget
                        ? this.contentEl.scrollTop + this.contentEl.clientHeight
                        : this.contentEl.scrollTop - this.contentEl.clientHeight);
        }
    };

    handleThumbDragStart = params => {
        params.axis === TYPE_X && this.props.thumbXProps.onDragStart && this.props.thumbXProps.onDragStart(params);
        params.axis === TYPE_Y && this.props.thumbYProps.onDragStart && this.props.thumbYProps.onDragStart(params);
    };

    handleThumbDragEnd = params => {
        params.axis === TYPE_X && this.props.thumbXProps.onDragEnd && this.props.thumbXProps.onDragEnd(params);
        params.axis === TYPE_Y && this.props.thumbYProps.onDragEnd && this.props.thumbYProps.onDragEnd(params);
    };

    handleThumbDrag = params => {
        this.scrollDetect();

        if (params.axis === TYPE_X) {
            this.props.thumbXProps.onDrag && this.props.thumbXProps.onDrag(params);

            this.contentEl.scrollLeft = Scrollbar.computeScrollForOffset(
                getInnerWidth(this.trackXEl),
                this.thumbXEl.clientWidth,
                params.offset,
                this.contentEl.scrollWidth,
                this.contentEl.clientWidth
            );
        }
        if (params.axis === TYPE_Y) {
            this.props.thumbYProps.onDrag && this.props.thumbYProps.onDrag(params);

            this.contentEl.scrollTop = Scrollbar.computeScrollForOffset(
                getInnerHeight(this.trackYEl),
                this.thumbYEl.clientHeight,
                params.offset,
                this.contentEl.scrollHeight,
                this.contentEl.clientHeight
            );
        }
    };

    render() {
        const {
            native,

            minimalThumbsSize,
            fallbackScrollbarWidth,

            scrollDetectionThreshold,

            tagName,
            className,
            style,

            trackClickBehavior,

            rtl,

            momentum,

            noDefaultStyles,

            translateContentSizesToHolder,

            noScrollX,
            noScrollY,
            noScroll,

            permanentTrackX,
            permanentTrackY,
            permanentTracks,

            removeTracksWhenNotUsed,
            removeTrackYWhenNotUsed,
            removeTrackXWhenNotUsed,

            wrapperProps: propsWrapperProps,
            contentProps: propsContentProps,
            trackXProps: propsTrackXProps,
            trackYProps: propsTrackYProps,
            thumbXProps: propsThumbXProps,
            thumbYProps: propsThumbYProps,

            wrapperRenderer,
            contentRenderer,
            trackXRenderer,
            trackYRenderer,
            thumbXRenderer,
            thumbYRenderer,

            onScroll,
            onScrollStart,
            onScrollStop,

            children,
            ...props
        } = this.props;
        const {trackXVisible, trackYVisible} = this.state;
        const scrollValues = this.getScrollValues();

        if (native) {
            return (
                <NativeScrollbar
                    rtl={rtl}
                    momentum={momentum}
                    permanentTrackX={permanentTrackX}
                    permanentTrackY={permanentTrackY}
                    permanentTracks={permanentTracks}
                    noScrollX={noScrollX}
                    noScrollY={noScrollY}
                    noScroll={noScroll}
                    tagName={tagName}
                    className={className}
                    style={style}
                    elementRef={ref => (this.contentEl = ref)}
                    onScroll={this.handleScrollEvent}
                    children={children}
                    {...props}
                />
            );
        }

        const browserSBW = getScrollbarWidth();
        const scrollbarWidth = browserSBW || fallbackScrollbarWidth;

        const wrapperProps = {...propsWrapperProps},
            contentProps = {...propsContentProps},
            trackXProps = {...propsTrackXProps},
            trackYProps = {...propsTrackYProps},
            thumbXProps = {...propsThumbXProps},
            thumbYProps = {...propsThumbYProps};

        if (!noDefaultStyles) {
            props.style = {
                ...defaultStyles.holder,
            };
            wrapperProps.style = {
                ...defaultStyles.wrapper,
                [this.state.isRtl ? "marginLeft" : "marginRight"]: trackYVisible ? 8 : null,
                marginBottom: trackXVisible ? 8 : null,
            };
            trackXProps.style = {
                ...defaultStyles.track.common,
                ...defaultStyles.track.x,
            };
            trackYProps.style = {
                ...defaultStyles.track.common,
                ...defaultStyles.track.y,
                [this.state.isRtl ? "left" : "right"]: 0,
            };
            thumbXProps.style = {
                ...defaultStyles.thumb.common,
                ...defaultStyles.thumb.x,
            };
            thumbYProps.style = {
                ...defaultStyles.thumb.common,
                ...defaultStyles.thumb.y,
            };
        }

        props.style = {
            ...props.style,
            ...style,
            ...(typeof rtl !== "undefined" && {direction: rtl ? "rtl" : "ltr"}),
        };
        wrapperProps.style = {
            ...wrapperProps.style,
            ...propsWrapperProps.style,
            position: "relative",
            overflow: "hidden",
        };
        contentProps.style = {
            ...defaultStyles.content,
            ...propsContentProps.style,
            ...(momentum && {WebkitOverflowScrolling: "touch"}),

            overflowY: scrollValues.scrollYPossible ? "scroll" : "hidden",
            overflowX: scrollValues.scrollXPossible ? "scroll" : "hidden",

            ...(this.state.isRtl
                ? {
                      paddingLeft: !browserSBW && scrollValues.scrollYPossible ? scrollbarWidth : null,
                      marginLeft: scrollValues.scrollYPossible ? -scrollbarWidth : null,
                  }
                : {
                      paddingRight: !browserSBW && scrollValues.scrollYPossible ? scrollbarWidth : null,
                      marginRight: scrollValues.scrollYPossible ? -scrollbarWidth : null,
                  }),

            paddingBottom: !browserSBW && scrollValues.scrollXPossible ? scrollbarWidth : null,
            marginBottom: scrollValues.scrollXPossible ? -scrollbarWidth : null,
        };
        trackXProps.style = {
            ...trackXProps.style,
            ...propsTrackXProps.style,
        };
        trackYProps.style = {
            ...trackYProps.style,
            ...propsTrackYProps.style,
        };
        thumbXProps.style = {
            ...thumbXProps.style,
            ...propsThumbXProps.style,
        };
        thumbYProps.style = {
            ...thumbYProps.style,
            ...propsThumbYProps.style,
        };

        props.className =
            "ScrollbarsCustom" +
            (trackYVisible ? " trackYVisible" : "") +
            (trackYVisible ? " trackXVisible" : "") +
            (this.state.isRtl ? " rtl" : "") +
            (className ? " " + className : "");
        contentProps.className = "content" + (contentProps.className ? " " + contentProps.className : "");
        wrapperProps.className = "wrapper" + (wrapperProps.className ? " " + wrapperProps.className : "");

        props.ref = ref => {
            this.holderEl = ref;
        };
        wrapperProps[wrapperRenderer ? "elementRef" : "ref"] = ref => {
            this.wrapperEl = ref;
        };
        contentProps[contentRenderer ? "elementRef" : "ref"] = ref => {
            this.contentEl = ref;
        };
        trackXProps.elementRef = ref => {
            this.trackXEl = ref;
        };
        trackYProps.elementRef = ref => {
            this.trackYEl = ref;
        };
        thumbXProps.elementRef = ref => {
            this.thumbXEl = ref;
        };
        thumbYProps.elementRef = ref => {
            this.thumbYEl = ref;
        };

        trackXProps.renderer = trackXRenderer;
        trackYProps.renderer = trackYRenderer;
        thumbXProps.renderer = thumbXRenderer;
        thumbYProps.renderer = thumbYRenderer;

        trackYProps.onClick = trackXProps.onClick = this.handleTrackClick;

        thumbYProps.onDragStart = thumbXProps.onDragStart = this.handleThumbDragStart;
        thumbYProps.onDragEnd = thumbXProps.onDragEnd = this.handleThumbDragEnd;
        thumbYProps.onDrag = thumbXProps.onDrag = this.handleThumbDrag;

        contentProps.children = children;

        wrapperProps.children = contentRenderer ? contentRenderer(contentProps) : <div {...contentProps} />;

        return (
            <this.props.tagName {...props}>
                {wrapperRenderer ? wrapperRenderer(wrapperProps) : <div {...wrapperProps} />}

                {(trackYVisible || !(removeTracksWhenNotUsed && removeTrackYWhenNotUsed)) && (
                    <Track type={TYPE_Y} {...trackYProps}>
                        <Thumb type={TYPE_Y} {...thumbYProps} />
                    </Track>
                )}

                {(trackXVisible || !(removeTracksWhenNotUsed && removeTrackXWhenNotUsed)) && (
                    <Track type={TYPE_X} {...trackXProps}>
                        <Thumb type={TYPE_X} {...thumbXProps} />
                    </Track>
                )}
            </this.props.tagName>
        );
    }
}
