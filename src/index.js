import PropTypes from "prop-types";
import React from "react";
import {getInnerHeight, getInnerWidth} from "./util/getInnerSizes";
import LoopController from "./util/LoopController";
import {getScrollbarWidth, isset} from "./util/utilities";

function divRenderer(props) {
    return <div {...props} />;
}

const defaultElementsStyles = {
    holder: {
        regular: {
            position: "relative",
            display: "flex",
        },
        native: {
            position: "relative",
        },
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
    trackVertical: {
        position: "absolute",
        width: 8,
        height: "calc(100% - 16px)",
        right: 0,
        top: 0,
        margin: "8px 0",
        background: "rgba(0,0,0,.1)",
        borderRadius: 4,
        overflow: "hidden",
    },
    trackHorizontal: {
        position: "absolute",
        height: 8,
        width: "calc(100% - 16px)",
        bottom: 0,
        left: 0,
        margin: "0 8px",
        background: "rgba(0,0,0,.1)",
        borderRadius: 4,
        overflow: "hidden",
    },
    thumbVertical: {
        cursor: "pointer",
        width: "100%",
        borderRadius: 4,
        background: "rgba(0,0,0,.4)",
    },
    thumbHorizontal: {
        cursor: "pointer",
        height: "100%",
        borderRadius: 4,
        background: "rgba(0,0,0,.4)",
    },
};

export default class Scrollbar extends React.Component {
    static displayName = "Scrollbar";

    static propTypes = {
        minimalThumbsSize: PropTypes.number,
        fallbackScrollbarWidth: PropTypes.number,

        rtl: PropTypes.bool,
        momentum: PropTypes.bool,
        defaultStyles: PropTypes.bool,
        nativeScrollbars: PropTypes.bool,

        permanentScrollbars: PropTypes.bool,
        permanentScrollbarX: PropTypes.bool,
        permanentScrollbarY: PropTypes.bool,

        noScroll: PropTypes.bool,
        noScrollX: PropTypes.bool,
        noScrollY: PropTypes.bool,

        tagName: PropTypes.string,

        className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        wrapperClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        contentClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        trackVerticalClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        trackHorizontalClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        thumbVerticalClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        thumbHorizontalClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

        style: PropTypes.object,
        wrapperStyle: PropTypes.object,
        contentStyle: PropTypes.object,
        trackVerticalStyle: PropTypes.object,
        trackHorizontalStyle: PropTypes.object,
        thumbVerticalStyle: PropTypes.object,
        thumbHorizontalStyle: PropTypes.object,

        onScroll: PropTypes.func,
        onScrollStart: PropTypes.func,
        onScrollStop: PropTypes.func,
        scrollDetectionThreshold: PropTypes.number,

        renderWrapper: PropTypes.func,
        renderContent: PropTypes.func,
        renderTrackVertical: PropTypes.func,
        renderTrackHorizontal: PropTypes.func,
        renderThumbVertical: PropTypes.func,
        renderThumbHorizontal: PropTypes.func,
    };

    static defaultProps = {
        minimalThumbsSize: 30,
        fallbackScrollbarWidth: 20,

        nativeScrollbars: false,
        defaultStyles: true,

        permanentScrollbarX: false,
        permanentScrollbars: false,
        permanentScrollbarY: false,

        noScroll: false,
        noScrollX: false,
        noScrollY: false,

        tagName: "div",

        scrollDetectionThreshold: 100,
    };

    componentDidMount() {
        this.isRtl = null;

        if (this.props.nativeScrollbars) {
            return;
        }

        LoopController.registerScrollbar(this);

        this.addListeners(true);
        this.update(true, true);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.nativeScrollbars !== prevProps.nativeScrollbars) {
            if (this.props.nativeScrollbars) {
                LoopController.unregisterScrollbar(this);
                this.removeListeners();
            } else {
                LoopController.registerScrollbar(this);
                this.addListeners(true);
            }
        }

        if (this.props.nativeScrollbars) {
            return;
        }

        if (
            prevProps.noScroll !== this.props.noScroll ||
            prevProps.noScrollY !== this.props.noScrollY ||
            prevProps.noScrollX !== this.props.noScrollX ||
            prevProps.rtl !== this.props.rtl ||
            prevProps.defaultStyles !== this.props.defaultStyles ||
            prevProps.permanentScrollbars !== this.props.permanentScrollbars ||
            prevProps.permanentScrollbarX !== this.props.permanentScrollbarX ||
            prevProps.permanentScrollbarY !== this.props.permanentScrollbarY
        ) {
            this.update(true, prevProps.rtl !== this.props.rtl);

            this.addListeners(
                prevProps.noScroll === this.props.noScroll,
                prevProps.noScrollY === this.props.noScrollY,
                prevProps.noScrollX === this.props.noScrollX
            );
        }

        if (
            prevProps.noScroll !== this.props.noScroll ||
            prevProps.onScrollStart !== this.props.onScrollStart ||
            prevProps.onScrollStop !== this.props.onScrollStop
        ) {
            if (!this.props.noScroll && (this.props.onScrollStart || this.props.onScrollStop)) {
                this.content.addEventListener("scroll", this.handleScrollEvent, {passive: true});
            } else {
                this.content.removeEventListener("scroll", this.handleScrollEvent, {passive: true});
            }
        }
    }

    componentWillUnmount() {
        LoopController.unregisterScrollbar(this);

        this.removeListeners();
    }

    /**
     * Return the vertical scroll position
     *
     * @return {number}
     */
    get scrollTop() {
        if (this.content) {
            return this.content.scrollTop;
        } else if (this.props.nativeScrollbars) {
            return this.holder.scrollTop;
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
        if (this.content) {
            this.content.scrollTop = top;
            this.update();
        } else if (this.props.nativeScrollbars) {
            this.holder.scrollTop = top;
        }
    }

    /**
     * Return the horizontal scroll position
     *
     * @return {number}
     */
    get scrollLeft() {
        if (this.content) {
            return this.content.scrollLeft;
        } else if (this.props.nativeScrollbars) {
            return this.holder.scrollLeft;
        }

        return 0;
    }

    /**
     * Set the horizontal scroll to given amount of pixels
     *
     * @param left {number} Pixels amount
     */
    set scrollLeft(left) {
        if (this.content) {
            this.content.scrollLeft = left;
            this.update();
        } else if (this.props.nativeScrollbars) {
            this.holder.scrollLeft = left;
        }
    }

    /**
     * @return {number}
     */
    get scrollHeight() {
        if (this.content) {
            return this.content.scrollHeight;
        } else if (this.props.nativeScrollbars) {
            return this.holder.scrollHeight;
        }

        return 0;
    }

    /**
     * @return {number}
     */
    get scrollWidth() {
        if (this.content) {
            return this.content.scrollWidth;
        } else if (this.props.nativeScrollbars) {
            return this.holder.scrollWidth;
        }

        return 0;
    }

    /**
     * @return {number}
     */
    get clientHeight() {
        if (this.content) {
            return this.content.clientHeight;
        } else if (this.props.nativeScrollbars) {
            return this.holder.clientHeight;
        }

        return 0;
    }

    /**
     * @return {number}
     */
    get clientWidth() {
        if (this.content) {
            return this.content.clientWidth;
        } else if (this.props.nativeScrollbars) {
            return this.holder.clientWidth;
        }

        return 0;
    }

    /**
     * Scrol to the top border
     *
     * @return {Scrollbar}
     */
    scrollToTop() {
        if (this.content) {
            this.content.scrollTop = 0;
        } else if (this.props.nativeScrollbars) {
            this.holder.scrollTop = 0;
        }

        return this;
    }

    /**
     * Scroll to the bottom border
     *
     * @return {Scrollbar}
     */
    scrollToBottom() {
        if (this.content) {
            this.content.scrollTop = this.content.scrollHeight;
        } else if (this.props.nativeScrollbars) {
            this.holder.scrollTop = this.holder.scrollHeight;
        }

        return this;
    }

    /**
     * Scrolls to the left border
     *
     * @return {Scrollbar}
     */
    scrollToLeft() {
        if (this.content) {
            this.content.scrollLeft = 0;
        } else if (this.props.nativeScrollbars) {
            this.holder.scrollLeft = 0;
        }

        return this;
    }

    /**
     * Scroll to the right border
     *
     * @return {Scrollbar}
     */
    scrollToRight() {
        if (this.content) {
            this.content.scrollLeft = this.content.scrollWidth;
        } else if (this.props.nativeScrollbars) {
            this.holder.scrollLeft = this.holder.scrollWidth;
        }

        return this;
    }

    /**
     * @return {Scrollbar}
     */
    addListeners = (noScrollChanged = false, noScrollYChanged = false, noScrollXChanged = false) => {
        if (!isset(document) || !this.content) {
            return this;
        }

        const {noScroll, noScrollY, noScrollX} = this.props;

        if (noScrollChanged) {
            if (noScroll) {
                this.removeListeners();

                return this;
            } else if (this.props.onScrollStart || this.props.onScrollStop) {
                this.content.addEventListener("scroll", this.handleScrollEvent, {passive: true});
            }
        }

        if (noScrollChanged || noScrollYChanged) {
            if (noScrollY) {
                this.trackVertical.removeEventListener("mousedown", this.handleTrackVerticalMousedownEvent);
                this.thumbVertical.removeEventListener("mousedown", this.handleThumbVerticalMousedownEvent);
            } else {
                this.trackVertical.addEventListener("mousedown", this.handleTrackVerticalMousedownEvent);
                this.thumbVertical.addEventListener("mousedown", this.handleThumbVerticalMousedownEvent);
            }
        }

        if (noScrollChanged || noScrollXChanged) {
            if (noScrollX) {
                this.trackHorizontal.removeEventListener("mousedown", this.handleTrackHorizontalMousedownEvent);
                this.thumbHorizontal.removeEventListener("mousedown", this.handleThumbHorizontalMousedownEvent);
            } else {
                this.trackHorizontal.addEventListener("mousedown", this.handleTrackHorizontalMousedownEvent);
                this.thumbHorizontal.addEventListener("mousedown", this.handleThumbHorizontalMousedownEvent);
            }
        }

        return this;
    };

    /**
     * @return {Scrollbar}
     */
    removeListeners = () => {
        if (!isset(document) || !this.content) {
            return this;
        }

        const {content, trackVertical, trackHorizontal, thumbVertical, thumbHorizontal} = this;

        content.removeEventListener("scroll", this.handleScrollEvent, {passive: true});
        trackVertical.removeEventListener("mousedown", this.handleTrackVerticalMousedownEvent);
        trackHorizontal.removeEventListener("mousedown", this.handleTrackHorizontalMousedownEvent);
        thumbVertical.removeEventListener("mousedown", this.handleThumbVerticalMousedownEvent);
        thumbHorizontal.removeEventListener("mousedown", this.handleThumbHorizontalMousedownEvent);

        this.handleDragEnd();

        if (this.scrollDetect.timeout) {
            clearTimeout(this.scrollDetect.timeout);
            this.scrollDetect.timeout = null;

            if (this.props.onScrollStop) {
                this.props.onScrollStop(this);
            }
        }

        return this;
    };

    scrollDetect = () => {
        if (!this.scrollDetect.timeout && this.props.onScrollStart) {
            this.props.onScrollStart(this);
        }

        this.scrollDetect.timeout && clearTimeout(this.scrollDetect.timeout);

        this.scrollDetect.timeout = setTimeout(() => {
            if (this.drag) {
                this.scrollDetect();
                return;
            }

            this.scrollDetect.timeout = null;
            if (this.props.onScrollStop) {
                this.props.onScrollStop(this);
            }
        }, this.props.scrollDetectionThreshold);
    };

    handleScrollEvent = () => {
        this.scrollDetect();
    };

    handleTrackVerticalMousedownEvent = e => {
        if (e.which !== 1) {
            return;
        }
        e.preventDefault();

        const offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY) - this.thumbVertical.clientHeight / 2;

        this.content.scrollTop = this.computeScrollTopForThumbOffset(Math.max(offset, 0));
    };

    handleTrackHorizontalMousedownEvent = e => {
        if (e.which !== 1) {
            return;
        }
        e.preventDefault();

        const offset =
            Math.abs(e.target.getBoundingClientRect().left - e.clientX) - this.thumbHorizontal.clientWidth / 2;

        this.content.scrollLeft = this.computeScrollLeftForThumbOffset(Math.max(offset, 0));
    };

    handleThumbVerticalMousedownEvent = e => {
        if (e.which !== 1) {
            return;
        }
        e.preventDefault();
        e.stopImmediatePropagation();

        this.handleDragStart();

        const {target, clientY} = e;
        this.dragPrevPageY = target.clientHeight - (clientY - target.getBoundingClientRect().top);
        this.thumbVertical.classList.add("dragging");
    };

    handleThumbHorizontalMousedownEvent = e => {
        if (e.which !== 1) {
            return;
        }
        e.preventDefault();
        e.stopImmediatePropagation();

        this.handleDragStart();

        const {target, clientX} = e;
        this.dragPrevPageX = target.clientWidth - (clientX - target.getBoundingClientRect().left);
        this.thumbHorizontal.classList.add("dragging");
    };

    handleDragStart = () => {
        this.drag = true;
        this.scrollDetect();

        this.bodySelectPrevValue = document.body.style.userSelect;
        this.documentOnselectstartPrevValue = document.onselectstart;

        document.addEventListener("mousemove", this.handleDragEvent);
        document.addEventListener("mouseup", this.handleDragEnd);

        document.body.style.userSelect = "none";
        document.onselectstart = () => false;
    };

    handleDragEnd = () => {
        this.drag = false;
        this.dragPrevPageX = null;
        this.dragPrevPageY = null;

        document.removeEventListener("mousemove", this.handleDragEvent);
        document.removeEventListener("mouseup", this.handleDragEnd);

        document.body.style.userSelect = this.bodySelectPrevValue;
        document.onselectstart = this.documentOnselectstartPrevValue;

        this.thumbHorizontal.classList.remove("dragging");
        this.thumbVertical.classList.remove("dragging");
    };

    handleDragEvent = e => {
        if (!this.drag) {
            return;
        }
        this.scrollDetect();

        if (this.dragPrevPageY !== null) {
            const offset =
                -this.trackVertical.getBoundingClientRect().top +
                e.clientY -
                (this.thumbVertical.clientHeight - this.dragPrevPageY);
            this.content.scrollTop = this.computeScrollTopForThumbOffset(offset);
        }
        if (this.dragPrevPageX !== null) {
            const offset =
                -this.trackHorizontal.getBoundingClientRect().left +
                e.clientX -
                (this.thumbHorizontal.clientWidth - this.dragPrevPageX);
            this.content.scrollLeft = this.computeScrollLeftForThumbOffset(offset);
        }
    };

    /**
     * Returns vertical thumb height corresponding viewport height to scrollable content height ratio
     *
     * @param trackHeight {number} Height of track where thumb placed
     * @return {number}
     */
    computeThumbVerticalHeight = trackHeight => {
        const height = Math.ceil((this.content.clientHeight / this.content.scrollHeight) * trackHeight);

        return trackHeight === height ? 0 : Math.max(height, this.props.minimalThumbsSize);
    };

    /**
     * Returns horizontal thumb width corresponding viewport width to scrollable content width ratio
     *
     * @param trackWidth {number} Width of track where thumb placed
     * @return {number}
     */
    computeThumbHorizontalWidth = trackWidth => {
        const width = Math.ceil((this.content.clientWidth / this.content.scrollWidth) * trackWidth);

        return trackWidth === width ? 0 : Math.max(width, this.props.minimalThumbsSize);
    };

    /**
     * Returns content's scrollTop value corresponding given thumb offset
     *
     * @param offset {number} Thumb's offset top, in pixels
     * @return {number}
     */
    computeScrollTopForThumbOffset = offset => {
        const trackVerticalInnerHeight = getInnerHeight(this.trackVertical);

        return (
            (offset / (trackVerticalInnerHeight - this.thumbVertical.clientHeight)) *
            (this.content.scrollHeight - this.content.clientHeight)
        );
    };

    /**
     * Returns content's scrollLeft value corresponding given thumb offset
     *
     * @param offset {number} Thumb's offset left, in pixels
     * @return {number}
     */
    computeScrollLeftForThumbOffset = offset => {
        const trackHorizontalInnerWidth = getInnerWidth(this.trackHorizontal);

        return (
            (offset / (trackHorizontalInnerWidth - this.thumbHorizontal.clientWidth)) *
            (this.content.scrollWidth - this.content.clientWidth)
        );
    };

    /**
     * Performs an actualisation of scrollbars and its thumbs
     *
     * @param forced {boolean} Whether to perform an update even if nothing has changed
     * @param rtlAutodetect {boolean} Whether to check the CSS value `direction`
     */
    update = (forced = false, rtlAutodetect = false) => {
        if (this.props.nativeScrollbars) {
            return;
        }

        // No need to update scrollbars if values had not changed
        if (!forced && (this.previousScrollValues || false)) {
            if (
                this.previousScrollValues.scrollTop === this.content.scrollTop &&
                this.previousScrollValues.scrollLeft === this.content.scrollLeft &&
                this.previousScrollValues.scrollHeight === this.content.scrollHeight &&
                this.previousScrollValues.scrollWidth === this.content.scrollWidth &&
                this.previousScrollValues.clientHeight === this.content.clientHeight &&
                this.previousScrollValues.clientWidth === this.content.clientWidth
            ) {
                return this;
            }
        }

        const verticalScrollNotBlocked = !this.props.noScroll && !this.props.noScrollY,
            horizontalScrollNotBlocked = !this.props.noScroll && !this.props.noScrollX,
            verticalScrollPossible = verticalScrollNotBlocked && this.content.scrollHeight > this.content.clientHeight,
            horizontalScrollPossible =
                horizontalScrollNotBlocked && this.content.scrollWidth > this.content.clientWidth;

        let isRtl = this.props.rtl;

        !isset(isRtl) &&
            (isRtl = rtlAutodetect ? getComputedStyle(this.content).direction === "rtl" : this.isRtl || false);

        if (forced || this.isRtl !== isRtl) {
            this.isRtl = isRtl;
            this.holder.classList.toggle("ScrollbarsCustom-RTL", this.isRtl);
        }

        if (forced) {
            const browserScrollbarWidth = getScrollbarWidth(),
                fallbackScrollbarWidth = this.props.fallbackScrollbarWidth;

            if (verticalScrollNotBlocked) {
                this.content.style.marginLeft = this.isRtl
                    ? -(browserScrollbarWidth || fallbackScrollbarWidth) + "px"
                    : null;
                this.content.style.paddingLeft = this.isRtl
                    ? (browserScrollbarWidth ? null : fallbackScrollbarWidth) + "px"
                    : null;
                this.content.style.marginRight = this.isRtl
                    ? null
                    : -(browserScrollbarWidth || fallbackScrollbarWidth) + "px";
                this.content.style.paddingRight = this.isRtl
                    ? null
                    : (browserScrollbarWidth ? null : fallbackScrollbarWidth) + "px";

                if (this.props.defaultStyles) {
                    this.trackVertical.style.left = this.isRtl ? 0 : null;
                    this.trackVertical.style.right = this.isRtl ? null : 0;
                }
            } else {
                this.content.style.marginLeft = this.content.style.paddingLeft = this.content.style.marginRight = this.content.style.paddingRight = null;
            }
        }

        this.trackVertical.style.display =
            verticalScrollPossible || this.props.permanentScrollbars || this.props.permanentScrollbarY ? null : "none";
        this.trackVertical.visibility =
            verticalScrollPossible || this.props.permanentScrollbars || this.props.permanentScrollbarY
                ? null
                : "hidden";

        this.trackHorizontal.style.display =
            horizontalScrollPossible || this.props.permanentScrollbars || this.props.permanentScrollbarX
                ? null
                : "none";
        this.trackHorizontal.visibility =
            horizontalScrollPossible || this.props.permanentScrollbars || this.props.permanentScrollbarX
                ? null
                : "hidden";

        if (verticalScrollPossible) {
            const trackVerticalInnerHeight = getInnerHeight(this.trackVertical);
            const thumbVerticalHeight = this.computeThumbVerticalHeight(trackVerticalInnerHeight);
            const thumbVerticalOffset = thumbVerticalHeight
                ? (this.content.scrollTop / (this.content.scrollHeight - this.content.clientHeight)) *
                  (trackVerticalInnerHeight - thumbVerticalHeight)
                : 0;

            this.thumbVertical.style.transform = `translateY(${thumbVerticalOffset}px)`;
            this.thumbVertical.style.height = thumbVerticalHeight + "px";
        } else {
            this.thumbVertical.style.transform = "translateY(0px)";
            this.thumbVertical.style.height = "0px";
        }

        if (horizontalScrollPossible) {
            const trackHorizontalInnerWidth = getInnerWidth(this.trackHorizontal);
            const thumbHorizontalWidth = this.computeThumbHorizontalWidth(trackHorizontalInnerWidth);
            let thumbHorizontalOffset = thumbHorizontalWidth
                ? (this.content.scrollLeft / (this.content.scrollWidth - this.content.clientWidth)) *
                  (trackHorizontalInnerWidth - thumbHorizontalWidth)
                : 0;

            if (this.isRtl) {
                thumbHorizontalOffset = -(trackHorizontalInnerWidth - thumbHorizontalWidth - thumbHorizontalOffset);
            }

            this.thumbHorizontal.style.transform = `translateX(${thumbHorizontalOffset}px)`;
            this.thumbHorizontal.style.width = thumbHorizontalWidth + "px";
        } else {
            this.thumbHorizontal.style.transform = "translateX(0px)";
            this.thumbHorizontal.style.width = "0px";
        }

        const currentScrollValues = {
            scrollTop: this.content.scrollTop,
            scrollLeft: this.content.scrollLeft,
            scrollHeight: this.content.scrollHeight,
            scrollWidth: this.content.scrollWidth,
            clientHeight: this.content.clientHeight,
            clientWidth: this.content.clientWidth,
        };

        (this.previousScrollValues || false) && this.props.onScroll && this.props.onScroll(currentScrollValues, this);

        this.previousScrollValues = currentScrollValues;

        return this;
    };

    nativeOnScrollHandler = () => {
        const currentScrollValues = {
            scrollTop: this.holder.scrollTop,
            scrollLeft: this.holder.scrollLeft,
            scrollHeight: this.holder.scrollHeight,
            scrollWidth: this.holder.scrollWidth,
            clientHeight: this.holder.clientHeight,
            clientWidth: this.holder.clientWidth,
        };

        (this.previousScrollValues || false) &&
            this.props.onScroll &&
            this.props.onScroll.call(this, currentScrollValues);

        this.previousScrollValues = currentScrollValues;

        this.scrollDetect();
    };

    render() {
        const {
            // numeric props
            minimalThumbsSize,
            fallbackScrollbarWidth,
            scrollDetectionThreshold,
            nativeScrollbars,

            // boolean props
            defaultStyles,
            noScroll,
            noScrollX,
            noScrollY,
            permanentScrollbars,
            permanentScrollbarX,
            permanentScrollbarY,
            rtl,
            momentum = true,

            // holder element props
            tagName,
            children,
            style,
            className,

            // other elements props
            wrapperStyle,
            contentStyle,
            trackVerticalStyle,
            trackHorizontalStyle,
            thumbVerticalStyle,
            thumbHorizontalStyle,
            wrapperClassName,
            contentClassName,
            trackVerticalClassName,
            trackHorizontalClassName,
            thumbVerticalClassName,
            thumbHorizontalClassName,

            // callbacks
            onScroll,
            onScrollStart,
            onScrollStop,

            // custom renderers
            renderWrapper,
            renderContent,
            renderTrackVertical,
            renderTrackHorizontal,
            renderThumbVertical,
            renderThumbHorizontal,

            ...props
        } = this.props;

        if (nativeScrollbars) {
            return React.createElement(
                tagName,
                {
                    ...props,
                    className: "ScrollbarsCustom-holder ScrollbarsCustom-native" + (className ? " " + className : ""),
                    style: {
                        ...(defaultStyles && defaultElementsStyles.holder.native),
                        ...style,
                        overflowX:
                            noScroll || noScrollX
                                ? "hidden"
                                : permanentScrollbars || permanentScrollbarX
                                    ? "scroll"
                                    : "auto",
                        overflowY:
                            noScroll || noScrollY
                                ? "hidden"
                                : permanentScrollbars || permanentScrollbarY
                                    ? "scroll"
                                    : "auto",
                        direction: (rtl === true && "rtl") || (rtl === false && "ltr") || null,
                    },
                    ref: ref => {
                        this.holder = ref;
                    },
                    onScroll: this.nativeOnScrollHandler,
                },
                children
            );
        }

        const browserScrollbarWidth = getScrollbarWidth();

        const holderClassNames = "ScrollbarsCustom-holder" + (className ? " " + className : ""),
            wrapperClassNames = "ScrollbarsCustom-wrapper" + (wrapperClassName ? " " + wrapperClassName : ""),
            contentClassNames = "ScrollbarsCustom-content" + (contentClassName ? " " + contentClassName : ""),
            trackVerticalClassNames =
                "ScrollbarsCustom-track ScrollbarsCustom-trackVertical" +
                (trackVerticalClassName ? " " + trackVerticalClassName : ""),
            trackHorizontalClassNames =
                "ScrollbarsCustom-track ScrollbarsCustom-trackHorizontal" +
                (trackHorizontalClassName ? " " + trackHorizontalClassName : ""),
            thumbVerticalClassNames =
                "ScrollbarsCustom-thumb ScrollbarsCustom-thumbHorizontal" +
                (thumbVerticalClassName ? " " + thumbVerticalClassName : ""),
            thumbHorizontalClassNames =
                "ScrollbarsCustom-thumb ScrollbarsCustom-thumbHorizontal" +
                (thumbHorizontalClassName ? " " + thumbHorizontalClassName : "");

        const holderStyles = {
                ...(defaultStyles && defaultElementsStyles.holder.regular),
                ...style,
                direction: (rtl === true && "rtl") || (rtl === false && "ltr") || null,
            },
            wrapperStyles = {
                ...(defaultStyles && defaultElementsStyles.wrapper),
                ...wrapperStyle,
                position: "relative",
                overflow: "hidden",
            },
            contentStyles = {
                ...defaultElementsStyles.content,
                ...contentStyle,
                overflowX: "scroll",
                overflowY: "scroll",
                marginBottom: -(browserScrollbarWidth || fallbackScrollbarWidth),
                paddingBottom: browserScrollbarWidth ? null : fallbackScrollbarWidth,
                ...(momentum && {WebkitOverflowScrolling: "touch"}),
            },
            trackVerticalStyles = {
                ...(defaultStyles && defaultElementsStyles.trackVertical),
                ...trackVerticalStyle,
            },
            trackHorizontalStyles = {
                ...(defaultStyles && defaultElementsStyles.trackHorizontal),
                ...trackHorizontalStyle,
            },
            thumbVerticalStyles = {
                ...(defaultStyles && defaultElementsStyles.thumbVertical),
                ...thumbVerticalStyle,
            },
            thumbHorizontalStyles = {
                ...(defaultStyles && defaultElementsStyles.thumbHorizontal),
                ...thumbHorizontalStyle,
            };

        if (noScroll || (noScrollX && noScrollY)) {
            contentStyles.marginRight = contentStyles.marginBottom = null;
            !browserScrollbarWidth && (contentStyles.paddingRight = contentStyles.paddingBottom = null);
            contentStyles.overflowX = contentStyles.overflowY = "hidden";

            trackVerticalStyles.display = trackHorizontalStyles.display = "none";
        } else if (noScrollY) {
            contentStyles.marginRight = null;
            !browserScrollbarWidth && (contentStyles.paddingRight = null);
            contentStyles.overflowX = "scroll";
            contentStyles.overflowY = "hidden";

            trackVerticalStyles.display = "none";
        } else if (noScrollX) {
            contentStyles.marginBottom = null;
            !browserScrollbarWidth && (contentStyles.paddingBottom = null);
            contentStyles.overflowY = "scroll";
            contentStyles.overflowX = "hidden";

            trackHorizontalStyles.display = "none";
        }

        if (permanentScrollbars || permanentScrollbarY) {
            trackVerticalStyles.display = null;

            if (noScroll || noScrollY) {
                thumbVerticalStyles.display = "none";
            }
        }

        if (permanentScrollbars || permanentScrollbarX) {
            trackHorizontalStyles.display = null;

            if (noScroll || noScrollX) {
                thumbHorizontalStyles.display = "none";
            }
        }

        return React.createElement(
            tagName,
            {
                ...props,
                className: holderClassNames,
                style: holderStyles,
                ref: ref => {
                    this.holder = ref;
                },
            },
            [
                (renderWrapper || divRenderer)({
                    key: "wrapper",
                    ref: ref => {
                        this.wrapper = ref;
                    },
                    className: wrapperClassNames,
                    style: wrapperStyles,
                    children: (renderContent || divRenderer)({
                        key: "content",
                        ref: ref => {
                            this.content = ref;
                        },
                        className: contentClassNames,
                        style: contentStyles,
                        children,
                    }),
                }),
                (renderTrackVertical || divRenderer)({
                    key: "trackVertical",
                    ref: ref => {
                        this.trackVertical = ref;
                    },
                    className: trackVerticalClassNames,
                    style: trackVerticalStyles,
                    children: (renderThumbVertical || divRenderer)({
                        key: "thumbVertical",
                        ref: ref => {
                            this.thumbVertical = ref;
                        },
                        className: thumbVerticalClassNames,
                        style: thumbVerticalStyles,
                    }),
                }),
                (renderTrackHorizontal || divRenderer)({
                    key: "trackHorizontal",
                    ref: ref => {
                        this.trackHorizontal = ref;
                    },
                    className: trackHorizontalClassNames,
                    style: trackHorizontalStyles,
                    children: (renderThumbHorizontal || divRenderer)({
                        key: "thumbHorizontal",
                        ref: ref => {
                            this.thumbHorizontal = ref;
                        },
                        className: thumbHorizontalClassNames,
                        style: thumbHorizontalStyles,
                    }),
                }),
            ]
        );
    }
}
