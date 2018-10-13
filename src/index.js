import PropTypes                         from "prop-types";
import React                             from "react";
import { getInnerHeight, getInnerWidth } from "./util/getInnerSizes";
import { LoopController }                from "./util/LoopController";
import { getScrollbarWidth, isset }      from "./util/utilities";

function divRenderer(props) {
    return <div { ...props } />;
}

const defaultElementsStyles = {
    holder:          {
        position: "relative",
        flex:     1,
    },
    wrapper:         {
        minHeight: "100%",
    },
    content:         {
        position: "absolute",
        top:      0,
        bottom:   0,
        right:    0,
        left:     0,
    },
    trackVertical:   {
        position:     "absolute",
        width:        8,
        height:       "calc(100% - 16px)",
        right:        0,
        top:          0,
        margin:       "8px 0",
        background:   "rgba(0,0,0,.1)",
        borderRadius: 4,
    },
    trackHorizontal: {
        position:     "absolute",
        height:       8,
        width:        "calc(100% - 16px)",
        bottom:       0,
        left:         0,
        margin:       "0 8px",
        background:   "rgba(0,0,0,.1)",
        borderRadius: 4,
    },
    thumbVertical:   {
        position:     "relative",
        cursor:       "pointer",
        width:        "100%",
        borderRadius: 4,
        background:   "rgba(0,0,0,.4)",
    },
    thumbHorizontal: {
        position:     "relative",
        cursor:       "pointer",
        height:       "100%",
        borderRadius: 4,
        background:   "rgba(0,0,0,.4)",
    },
};

export default class Scrollbar extends React.Component
{
    static propTypes = {
        minimalThumbsSize:     PropTypes.number,
        browserScrollbarWidth: PropTypes.number,

        defaultStyles: PropTypes.bool,

        permanentScrollbars: PropTypes.bool,
        permanentScrollbarX: PropTypes.bool,
        permanentScrollbarY: PropTypes.bool,

        noScroll:  PropTypes.bool,
        noScrollX: PropTypes.bool,
        noScrollY: PropTypes.bool,

        tagName:                  PropTypes.string,
        className:                PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        wrapperClassName:         PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        contentClassName:         PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        trackVerticalClassName:   PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        trackHorizontalClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        thumbVerticalClassName:   PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        thumbHorizontalClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

        onScroll:                 PropTypes.func,
        onScrollStart:            PropTypes.func,
        onScrollStop:             PropTypes.func,
        scrollDetectionThreshold: PropTypes.number,
    };

    static defaultProps = {
        minimalThumbsSize:      30,
        fallbackScrollbarWidth: 20,

        defaultStyles: true,

        permanentScrollbarX: false,
        permanentScrollbars: false,
        permanentScrollbarY: false,

        noScroll:  false,
        noScrollX: false,
        noScrollY: false,

        tagName: "div",

        scrollDetectionThreshold: 100,
    };

    componentDidMount() {
        LoopController.registerScrollbar(this);

        this.addListeners();
    }

    componentWillUnmount() {
        LoopController.unregisterScrollbar(this);

        this.handleDragEnd();
        this.removeListeners();
    }

    /**
     * @return {Scrollbar}
     */
    addListeners = () => {
        if (!isset(document) || !this.content) {return this;}

        const {content, trackVertical, trackHorizontal, thumbVertical, thumbHorizontal} = this;
        const {noScroll, noScrollY, noScrollX} = this.props;

        if (noScroll) {
            this.removeListeners();

            return this;
        }
        else {
            content.addEventListener("scroll", this.handleScrollEvent, {passive: true});
        }

        if (noScrollY) {
            trackVertical.removeEventListener("mousedown", this.handleTrackVerticalMousedownEvent);
            thumbVertical.removeEventListener("mousedown", this.handleThumbVerticalMousedownEvent);
        }
        else {
            trackVertical.addEventListener("mousedown", this.handleTrackVerticalMousedownEvent);
            thumbVertical.addEventListener("mousedown", this.handleThumbVerticalMousedownEvent);
        }

        if (noScrollX) {
            trackHorizontal.removeEventListener("mousedown", this.handleTrackHorizontalMousedownEvent);
            thumbHorizontal.removeEventListener("mousedown", this.handleThumbHorizontalMousedownEvent);
        }
        else {
            trackHorizontal.addEventListener("mousedown", this.handleTrackHorizontalMousedownEvent);
            thumbHorizontal.addEventListener("mousedown", this.handleThumbHorizontalMousedownEvent);
        }

        return this;
    };

    /**
     * @return {Scrollbar}
     */
    removeListeners = () => {
        if (!isset(document) || !this.content) { return this; }

        const {trackVertical, trackHorizontal, thumbVertical, thumbHorizontal} = this;

        trackVertical.removeEventListener("mousedown", this.handleTrackVerticalMousedownEvent);
        trackHorizontal.removeEventListener("mousedown", this.handleTrackHorizontalMousedownEvent);
        thumbVertical.removeEventListener("mousedown", this.handleThumbVerticalMousedownEvent);
        thumbHorizontal.removeEventListener("mousedown", this.handleThumbHorizontalMousedownEvent);

        return this;
    };

    scrollDetect = () => {
        if (this.scrolling) { return; }

        this.scrolling = true;

        if (this.props.onScrollStart) { this.props.onScrollStart(); }

        this.scrollDetect.interval = setInterval(
                () => {
                    if (this.scrollDetect.lastScrollTop === this.content.scrollTop && this.scrollDetect.lastScrollLeft === this.content.scrollLeft && !this.drag) {
                        clearInterval(this.scrollDetect.interval);
                        this.scrolling = false;

                        if (this.props.onScrollStop) { this.props.onScrollStop(); }
                    }

                    this.scrollDetect.lastScrollTop = this.content.scrollTop;
                    this.scrollDetect.lastScrollLeft = this.content.scrollLeft;
                },
                this.props.scrollDetectionThreshold,
        );
    };

    handleScrollEvent = () => {
        this.scrollDetect();
    };

    handleTrackVerticalMousedownEvent = (e) => {
        if (e.which !== 1) {return;}
        e.preventDefault();

        const offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY) - this.thumbVertical.clientHeight / 2;

        this.content.scrollTop = this.computeScrollTopForThumbOffset(offset);
    };

    handleTrackHorizontalMousedownEvent = (e) => {
        if (e.which !== 1) {return;}
        e.preventDefault();

        const offset = Math.abs(e.target.getBoundingClientRect().left - e.clientX) - this.thumbHorizontal.clientWidth / 2;

        this.content.scrollLeft = this.computeScrollLeftForThumbOffset(offset);
    };

    handleThumbVerticalMousedownEvent = (e) => {
        if (e.which !== 1) {return;}
        e.preventDefault();
        e.stopImmediatePropagation();

        this.handleDragStart();

        const {target, clientY} = e;
        this.dragPrevPageY = target.clientHeight - (clientY - target.getBoundingClientRect().top);
        this.thumbVertical.classList.add("dragging");
    };

    handleThumbHorizontalMousedownEvent = (e) => {
        if (e.which !== 1) {return;}
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
        this.dragPrevPageX = undefined;
        this.dragPrevPageY = undefined;

        document.removeEventListener("mousemove", this.handleDragEvent);
        document.removeEventListener("mouseup", this.handleDragEnd);

        document.body.style.userSelect = this.bodySelectPrevValue;
        document.onselectstart = this.documentOnselectstartPrevValue;

        this.thumbHorizontal.classList.remove("dragging");
        this.thumbVertical.classList.remove("dragging");
    };

    handleDragEvent = (e) => {
        if (!this.drag) {return;}

        if (this.dragPrevPageY !== undefined) {
            const offset = -this.trackVertical.getBoundingClientRect().top + e.clientY - (this.thumbVertical.clientHeight - this.dragPrevPageY);
            this.content.scrollTop = this.computeScrollTopForThumbOffset(offset);
        }
        if (this.dragPrevPageX !== undefined) {
            const offset = -this.trackHorizontal.getBoundingClientRect().left + e.clientX - (this.thumbHorizontal.clientWidth - this.dragPrevPageX);
            this.content.scrollLeft = this.computeScrollLeftForThumbOffset(offset);
        }
    };

    /**
     * Returns vertical thumb height corresponding viewport height to scrollable content height ratio
     *
     * @param trackHeight {number} Height of track where thumb placed
     * @return {number}
     */
    computeThumbVerticalHeight(trackHeight) {
        const {scrollHeight, clientHeight} = this.content;
        const {minimalThumbsSize} = this.props;
        const height = Math.ceil(clientHeight / scrollHeight * trackHeight);

        return trackHeight === height ? 0 : Math.max(height, minimalThumbsSize);
    }

    /**
     * Returns horizontal thumb width corresponding viewport width to scrollable content width ratio
     *
     * @param trackWidth {number} Width of track where thumb placed
     * @return {number}
     */
    computeThumbHorizontalWidth(trackWidth) {
        const {scrollWidth, clientWidth} = this.content;
        const {minimalThumbsSize} = this.props;
        const width = Math.ceil(clientWidth / scrollWidth * trackWidth);

        return trackWidth === width ? 0 : Math.max(width, minimalThumbsSize);
    }

    /**
     * Returns content's scrollTop value corresponding given thumb offset
     *
     * @param offset {number} Thumb's offset top, in pixels
     * @return {number}
     */
    computeScrollTopForThumbOffset(offset) {
        const {clientHeight, scrollHeight} = this.content;
        const trackVerticalInnerHeight = getInnerHeight(this.trackVertical);
        const thumbVerticalHeight = this.thumbVertical.clientHeight;

        return offset / (trackVerticalInnerHeight - thumbVerticalHeight) * (scrollHeight - clientHeight);
    }

    /**
     * Returns content's scrollLeft value corresponding given thumb offset
     *
     * @param offset {number} Thumb's offset left, in pixels
     * @return {number}
     */
    computeScrollLeftForThumbOffset(offset) {
        const {clientWidth, scrollWidth} = this.content;
        const trackHorizontalInnerWidth = getInnerWidth(this.trackHorizontal);
        const thumbHorizontalWidth = this.thumbHorizontal.clientWidth;

        return offset / (trackHorizontalInnerWidth - thumbHorizontalWidth) * (scrollWidth - clientWidth);
    }

    /**
     * Performs an actualisation of scrollbars and its thumbs
     *
     * @param forced {boolean} Whether to perform an update even if nothing has changed
     */
    update(forced = false) {
        // No need to update scrollbars if values had not changed
        if (!forced && (this.previousScrollValues || false) && Object.keys(this.previousScrollValues).every((prop) => {return this.previousScrollValues[prop] === this.content[prop]; })) {
            return;
        }

        this.previousScrollValues = {
            scrollTop:    this.content.scrollTop,
            scrollLeft:   this.content.scrollLeft,
            scrollHeight: this.content.scrollHeight,
            scrollWidth:  this.content.scrollWidth,
            clientHeight: this.content.clientHeight,
            clientWidth:  this.content.clientWidth,
        };

        const verticalScrollPossible   = this.content.scrollHeight > this.content.clientHeight && !this.props.noScroll && !this.props.noScrollY,
              horizontalScrollPossible = this.content.scrollWidth > this.content.clientWidth && !this.props.noScroll && !this.props.noScrollX;

        this.trackVertical.style.display = (verticalScrollPossible || this.props.permanentScrollbars || this.props.permanentScrollbarY) ? null : "none";
        this.trackVertical.visibility = (verticalScrollPossible || this.props.permanentScrollbars || this.props.permanentScrollbarY) ? null : "hidden";

        this.trackHorizontal.style.display = (horizontalScrollPossible || this.props.permanentScrollbars || this.props.permanentScrollbarX) ? null : "none";
        this.trackHorizontal.visibility = (horizontalScrollPossible || this.props.permanentScrollbars || this.props.permanentScrollbarX) ? null : "hidden";

        if (verticalScrollPossible) {
            const trackVerticalInnerHeight = getInnerHeight(this.trackVertical);
            const thumbVerticalHeight = this.computeThumbVerticalHeight(trackVerticalInnerHeight);
            const thumbVerticalOffset = thumbVerticalHeight ? this.content.scrollTop / (this.content.scrollHeight - this.content.clientHeight) * (trackVerticalInnerHeight - thumbVerticalHeight) : 0;

            this.thumbVertical.style.transform = `translateY(${thumbVerticalOffset}px)`;
            this.thumbVertical.style.height = thumbVerticalHeight + "px";
        }
        else {
            this.thumbVertical.style.transform = "translateY(0px)";
            this.thumbVertical.style.height = "0px";
        }

        if (horizontalScrollPossible) {
            const trackHorizontalInnerWidth = getInnerWidth(this.trackHorizontal);
            const thumbHorizontalWidth = this.computeThumbHorizontalWidth(trackHorizontalInnerWidth);
            const thumbHorizontalOffset = thumbHorizontalWidth ? this.content.scrollLeft / (this.content.scrollWidth - this.content.clientWidth) * (trackHorizontalInnerWidth - thumbHorizontalWidth) : 0;

            this.thumbHorizontal.style.transform = `translateX(${thumbHorizontalOffset}px)`;
            this.thumbHorizontal.style.width = thumbHorizontalWidth + "px";
        }
        else {
            this.thumbHorizontal.style.transform = "translateX(0px)";
            this.thumbHorizontal.style.width = "0px";
        }

        this.props.onScroll && this.props.onScroll(this.previousScrollValues, this);
    }

    render() {
        const {
                  // numeric props
                  minimalThumbsSize, fallbackScrollbarWidth, scrollDetectionThreshold,

                  // boolean props
                  defaultStyles, noScroll, noScrollX, noScrollY, permanentScrollbars, permanentScrollbarX, permanentScrollbarY,

                  // holder element props
                  tagName, children, style, className,

                  // other elements props
                  wrapperStyle, contentStyle, trackVerticalStyle, trackHorizontalStyle, thumbVerticalStyle, thumbHorizontalStyle,
                  wrapperClassName, contentClassName, trackVerticalClassName, trackHorizontalClassName, thumbVerticalClassName, thumbHorizontalClassName,

                  // callbacks
                  onScroll, onScrollStart, onScrollStop,
                  ...props
              } = this.props;

        const browserScrollbarWidth = getScrollbarWidth();

        const holderClassNames          = ["ScrollbarsCustom-holder"]
                .concat((className || false) ? (typeof className === "string" ? [className] : className) : [])
                .join(" "),
              wrapperClassNames         = ["ScrollbarsCustom-wrapper"]
                      .concat((wrapperClassName || false) ? (typeof wrapperClassName === "string" ? [wrapperClassName] : wrapperClassName) : [])
                      .join(" "),
              contentClassNames         = ["ScrollbarsCustom-content"]
                      .concat((contentClassName || false) ? (typeof contentClassName === "string" ? [contentClassName] : contentClassName) : [])
                      .join(" "),
              trackVerticalClassNames   = ["ScrollbarsCustom-track", "ScrollbarsCustom-trackVertical"]
                      .concat((trackVerticalClassName || false) ? (typeof trackVerticalClassName === "string" ? [trackVerticalClassName] : trackVerticalClassName) : [])
                      .join(" "),
              trackHorizontalClassNames = ["ScrollbarsCustom-track", "ScrollbarsCustom-trackHorizontal"]
                      .concat((thumbVerticalClassName || false) ? (typeof thumbVerticalClassName === "string" ? [thumbVerticalClassName] : thumbVerticalClassName) : [])
                      .join(" "),
              thumbVerticalClassNames   = ["ScrollbarsCustom-thumb", "ScrollbarsCustom-thumbVertical"]
                      .concat((trackHorizontalClassName || false) ? (typeof trackHorizontalClassName === "string" ? [trackHorizontalClassName] : trackHorizontalClassName) : [])
                      .join(" "),
              thumbHorizontalClassNames = ["ScrollbarsCustom-thumb", "ScrollbarsCustom-thumbHorizontal"]
                      .concat((thumbHorizontalClassName || false) ? (typeof thumbHorizontalClassName === "string" ? [thumbHorizontalClassName] : thumbHorizontalClassName) : [])
                      .join(" ");

        const holderStyles          = {
                  ...style,
                  ...(defaultStyles && defaultElementsStyles.holder),
              },
              wrapperStyles         = {
                  ...wrapperStyle,
                  ...(defaultStyles && defaultElementsStyles.wrapper),
                  position: "relative",
                  overflow: "hidden",
              },
              contentStyles         = {
                  ...contentStyle,
                  ...defaultElementsStyles.content,
                  overflowX:     "scroll",
                  overflowY:     "scroll",
                  marginRight:   -(browserScrollbarWidth || fallbackScrollbarWidth),
                  marginBottom:  -(browserScrollbarWidth || fallbackScrollbarWidth),
                  paddingRight:  (browserScrollbarWidth ? null : fallbackScrollbarWidth),
                  paddingBottom: (browserScrollbarWidth ? null : fallbackScrollbarWidth),
              },
              trackVerticalStyles   = {
                  ...trackVerticalStyle,
                  ...(defaultStyles && defaultElementsStyles.trackVertical),
              },
              trackHorizontalStyles = {
                  ...trackHorizontalStyle,
                  ...(defaultStyles && defaultElementsStyles.trackHorizontal),
              },
              thumbVerticalStyles   = {
                  ...thumbVerticalStyle,
                  ...(defaultStyles && defaultElementsStyles.thumbVertical),
              },
              thumbHorizontalStyles = {
                  ...thumbHorizontalStyle,
                  ...(defaultStyles && defaultElementsStyles.thumbHorizontal),
              };

        return React.createElement(
                tagName,
                {
                    ...props,
                    className: holderClassNames,
                    style:     holderStyles,
                    ref:       (ref) => {this.holder = ref;},
                },
                [
                    divRenderer({
                                    key:       "wrapper",
                                    ref:       (ref) => {this.wrapper = ref;},
                                    className: wrapperClassNames,
                                    style:     wrapperStyles,
                                    children:  divRenderer({
                                                               key:       "content",
                                                               ref:       (ref) => {this.content = ref;},
                                                               className: contentClassNames,
                                                               style:     contentStyles,
                                                               children,
                                                           }),
                                }),
                    divRenderer({
                                    key:       "trackVertical",
                                    ref:       (ref) => {this.trackVertical = ref;},
                                    className: trackVerticalClassNames,
                                    style:     trackVerticalStyles,
                                    children:  divRenderer({
                                                               key:       "thumbVertical",
                                                               ref:       (ref) => {this.thumbVertical = ref;},
                                                               className: thumbVerticalClassNames,
                                                               style:     thumbVerticalStyles,
                                                           }),
                                }),
                    divRenderer({
                                    key:       "trackHorizontal",
                                    ref:       (ref) => {this.trackHorizontal = ref;},
                                    className: trackHorizontalClassNames,
                                    style:     trackHorizontalStyles,
                                    children:  divRenderer({
                                                               key:       "thumbHorizontal",
                                                               ref:       (ref) => {this.thumbHorizontal = ref;},
                                                               className: thumbHorizontalClassNames,
                                                               style:     thumbHorizontalStyles,
                                                           }),
                                }),
                ],
        );
    }
}
