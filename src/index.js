import PropTypes from "prop-types";
import React from "react";
import Thumb from "./Thumb";
import Track, { TYPE_X, TYPE_Y } from "./Track";
import { getInnerHeight, getInnerWidth } from "./util/getInnerSizes";
import getScrollbarWidth from "./util/getScrollbarWidth";
import LoopController from "./util/LoopController";

const defaultStyles = {
  holder: {
    position: "relative",
    display: "flex"
  },
  wrapper: {
    flexGrow: 1
  },
  content: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  track: {
    common: {
      position: "absolute",
      overflow: "hidden",
      borderRadius: 4,
      background: "rgba(0,0,0,.1)",
      userSelect: "none"
    },
    x: {
      height: 8,
      width: "calc(100% - 16px)",
      bottom: 0,
      left: 8
    },
    y: {
      width: 8,
      height: "calc(100% - 16px)",
      top: 8
    }
  },
  thumb: {
    common: {
      cursor: "pointer",
      borderRadius: 4,
      background: "rgba(0,0,0,.4)"
    },
    x: {
      height: "100%"
    },
    y: {
      width: "100%"
    }
  }
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
 */

export default class Scrollbar extends React.Component {
  static propTypes = {
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

    //captureScroll: PropTypes.bool,

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
    onScrollStop: PropTypes.func
  };

  static defaultProps = {
    tagName: "div",
    minimalThumbsSize: 30,
    fallbackScrollbarWidth: 20,

    trackClickBehavior: "jump",

    momentum: false,

    noDefaultStyles: false,

    scrollDetectionThreshold: 100,

    //captureScroll: false,

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
    thumbYProps: {}
  };

  /**
   * Compute the thumb size
   *
   * @param {number} trackSize
   * @param {number} scrollableSize
   * @param {number} viewportSize
   * @return {number}
   */
  computeThumbSize(trackSize, scrollableSize, viewportSize) {
    const size = Math.ceil((viewportSize / scrollableSize) * trackSize);

    return trackSize === size
      ? 0
      : Math.max(size, this.props.minimalThumbsSize);
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
  static computeThumbOffset(
    trackSize,
    thumbSize,
    scrollableSize,
    viewportSize,
    scrollValue
  ) {
    return thumbSize
      ? (scrollValue / (scrollableSize - viewportSize)) *
          (trackSize - thumbSize)
      : 0;
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
  static computeScrollForOffset(
    trackSize,
    thumbSize,
    offset,
    scrollableSize,
    viewportSize
  ) {
    return (
      ((offset - thumbSize / 2) / (trackSize - thumbSize)) *
      (scrollableSize - viewportSize)
    );
  }

  constructor(props) {
    super(props);

    /**
     * @property {ScrollValues} scrollValues
     */
    this.scrollValues = {
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
      trackXVisible: null
    };

    this.state = {
      trackYVisible: true,
      trackXVisible: true,
      isRtl: this.props.rtl
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.rtl !== prevProps.rtl &&
      this.props.rtl !== this.state.isRtl
    ) {
      this.setState({ isRtl: this.props.rtl });
    }

    if (this.state.isRtl !== prevState.isRtl) {
      this.update();
    }
  }

  componentDidMount() {
    LoopController.registerScrollbar(this);

    //this.contentEl.addEventListener("mousewheel", this.scrollCaptor);
    this.contentEl.addEventListener("scroll", this.handleScrollEvent, {
      passive: true
    });

    this.update();
  }

  componentWillUnmount() {
    LoopController.unregisterScrollbar(this);

    //this.contentEl.removeEventListener("mousewheel", this.scrollCaptor);
    this.contentEl.removeEventListener("scroll", this.handleScrollEvent, {
      passive: true
    });
  }

  handleScrollEvent = () => {
    this.scrollDetect();
  };

  //scrollCaptor = (ev) => {
  //    if (!this.contentEl) {return;}
  //
  //    const cancelEvent = () => {
  //        ev.stopPropagation();
  //        ev.preventDefault();
  //        ev.returnValue = false;
  //    };
  //
  //    let scrollDirection = null;
  //
  //    if (ev.type === "mousewheel") {
  //        if (ev.wheelDelta > 0) { // scroll up
  //            scrollDirection = (ev.wheelDeltaY && !ev.shiftKey) ? "up" : "left";
  //        }
  //        else { // scroll down
  //            scrollDirection = (ev.wheelDeltaY && !ev.shiftKey) ? "down" : "right";
  //        }
  //    }
  //
  //    if (scrollDirection) {
  //        if (
  //                (scrollDirection === 'up' && !this.scrollValues.scrollTop) ||
  //                (scrollDirection === 'left' && !this.scrollValues.scrollLeft <= 0) ||
  //                (scrollDirection === 'down' && this.scrollValues.scrollTop + this.scrollValues.clientHeight === this.scrollValues.scrollHeight) ||
  //                (scrollDirection === 'right' && this.scrollValues.scrollLeft + this.scrollValues.clientWidth === this.scrollValues.scrollWidth)
  //        ) {
  //            return cancelEvent();
  //        }
  //    }
  //};

  scrollDetect = () => {
    if (!this.props.onScrollStart && !this.props.onScrollStop) {
      return;
    }

    !this.scrollDetect.timeout &&
      this.props.onScrollStart &&
      this.props.onScrollStart.call(this, this.scrollValues);

    this.scrollDetect.timeout && clearTimeout(this.scrollDetect.timeout);

    this.scrollDetect.timeout = setTimeout(() => {
      this.scrollDetect.timeout = null;
      this.props.onScrollStop &&
        this.props.onScrollStop.call(this, this.scrollValues);
    }, this.props.scrollDetectionThreshold);
  };

  /**
   * Return the vertical scroll position
   *
   * @return {number}
   */
  get scrollTop() {
    if (this.content) {
      return this.content.scrollTop;
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
    }
  }

  /**
   * @return {number}
   */
  get scrollHeight() {
    if (this.content) {
      return this.content.scrollHeight;
    }

    return 0;
  }

  /**
   * @return {number}
   */
  get scrollWidth() {
    if (this.content) {
      return this.content.scrollWidth;
    }

    return 0;
  }

  /**
   * @return {number}
   */
  get clientHeight() {
    if (this.content) {
      return this.content.clientHeight;
    }

    return 0;
  }

  /**
   * @return {number}
   */
  get clientWidth() {
    if (this.content) {
      return this.content.clientWidth;
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
    }

    return this;
  }

  /**
   *
   * @param forced
   * @return {ScrollValues}
   */
  update = (forced = false) => {
    if (typeof this.state.isRtl !== "boolean") {
      this.setState({
        isRtl: getComputedStyle(this.contentEl).direction === "rtl"
      });

      return;
    }

    /**
     *
     * @type {ScrollValues}
     */
    const currentScrollValues = {
      clientHeight: this.contentEl.clientHeight,
      scrollHeight: this.contentEl.scrollHeight,
      scrollTop: this.contentEl.scrollTop,
      clientWidth: this.contentEl.clientWidth,
      scrollWidth: this.contentEl.scrollWidth,
      scrollLeft: this.contentEl.scrollLeft,
      scrollXBlocked: null,
      scrollYBlocked: null,
      scrollXPossible: null,
      scrollYPossible: null,
      trackXVisible: null,
      trackYVisible: null
    };
    currentScrollValues.scrollXBlocked =
      this.props.noScroll || this.props.noScrollX;
    currentScrollValues.scrollYBlocked =
      this.props.noScroll || this.props.noScrollY;
    currentScrollValues.scrollXPossible =
      !currentScrollValues.scrollXBlocked &&
      currentScrollValues.scrollWidth > currentScrollValues.clientWidth;
    currentScrollValues.scrollYPossible =
      !currentScrollValues.scrollYBlocked &&
      currentScrollValues.scrollHeight > currentScrollValues.clientHeight;
    currentScrollValues.trackXVisible =
      currentScrollValues.scrollXPossible ||
      this.props.permanentTracks ||
      this.props.permanentTrackX;
    currentScrollValues.trackYVisible =
      currentScrollValues.scrollYPossible ||
      this.props.permanentTracks ||
      this.props.permanentTrackY;

    let mask = 0;

    this.scrollValues.clientHeight !== currentScrollValues.clientHeight &&
      (mask |= 1 << 0);
    this.scrollValues.clientWidth !== currentScrollValues.clientWidth &&
      (mask |= 1 << 1);
    this.scrollValues.scrollHeight !== currentScrollValues.scrollHeight &&
      (mask |= 1 << 2);
    this.scrollValues.scrollWidth !== currentScrollValues.scrollWidth &&
      (mask |= 1 << 3);
    this.scrollValues.scrollTop !== currentScrollValues.scrollTop &&
      (mask |= 1 << 4);
    this.scrollValues.scrollLeft !== currentScrollValues.scrollLeft &&
      (mask |= 1 << 5);
    this.scrollValues.scrollYBlocked !== currentScrollValues.scrollYBlocked &&
      (mask |= 1 << 6);
    this.scrollValues.scrollXBlocked !== currentScrollValues.scrollXBlocked &&
      (mask |= 1 << 7);
    this.scrollValues.scrollYPossible !== currentScrollValues.scrollYPossible &&
      (mask |= 1 << 8);
    this.scrollValues.scrollXPossible !== currentScrollValues.scrollXPossible &&
      (mask |= 1 << 9);
    this.scrollValues.trackYVisible !== currentScrollValues.trackYVisible &&
      (mask |= 1 << 10);
    this.scrollValues.trackXVisible !== currentScrollValues.trackXVisible &&
      (mask |= 1 << 11);

    // if not forced and nothing has changed - do not update
    if (mask === 0 && !forced) {
      return false;
    }

    // if scrollbars visibility has changed
    if (mask & (1 << 10) || mask & (1 << 11)) {
      this.scrollValues.trackYVisible = currentScrollValues.trackYVisible;
      this.scrollValues.trackXVisible = currentScrollValues.trackXVisible;

      this.setState({
        trackYVisible: currentScrollValues.trackYVisible,
        trackXVisible: currentScrollValues.trackXVisible
      });

      return this.update(true);
    }

    this.scrollValues = currentScrollValues;

    // if Y track rendered and changed anything related to scrollY
    if (this.trackYEl) {
      mask & (1 << 10) &&
        (this.trackYEl.style.display = currentScrollValues.trackYVisible
          ? null
          : "none");

      if (
        mask & (1 << 0) ||
        mask & (1 << 2) ||
        mask & (1 << 4) ||
        mask & (1 << 6) ||
        mask & (1 << 8)
      ) {
        if (currentScrollValues.scrollYPossible) {
          const trackSize = getInnerHeight(this.trackYEl);
          const thumbSize = this.computeThumbSize(
            trackSize,
            currentScrollValues.scrollHeight,
            currentScrollValues.clientHeight
          );
          const thumbOffset = Scrollbar.computeThumbOffset(
            trackSize,
            thumbSize,
            currentScrollValues.scrollHeight,
            currentScrollValues.clientHeight,
            currentScrollValues.scrollTop
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
      mask & (1 << 11) &&
        (this.trackXEl.style.display = currentScrollValues.trackXVisible
          ? null
          : "none");

      if (
        mask & (1 << 1) ||
        mask & (1 << 3) ||
        mask & (1 << 5) ||
        mask & (1 << 7) ||
        mask & (1 << 9)
      ) {
        if (currentScrollValues.scrollXPossible) {
          const trackSize = getInnerWidth(this.trackXEl);
          const thumbSize = this.computeThumbSize(
            trackSize,
            currentScrollValues.scrollWidth,
            currentScrollValues.clientWidth
          );
          let thumbOffset = Scrollbar.computeThumbOffset(
            trackSize,
            thumbSize,
            currentScrollValues.scrollWidth,
            currentScrollValues.clientWidth,
            currentScrollValues.scrollLeft
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

    this.props.onScroll && this.props.onScroll(this.scrollValues);

    return this.scrollValues;
  };

  handleTrackClick = (e, params) => {
    params.axis === TYPE_X &&
      this.props.trackXProps.onClick &&
      this.props.trackXProps.onClick(e, params);
    params.axis === TYPE_Y &&
      this.props.trackYProps.onClick &&
      this.props.trackYProps.onClick(e, params);

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
    params.axis === TYPE_X &&
      this.props.thumbXProps.onDragStart &&
      this.props.thumbXProps.onDragStart(params);
    params.axis === TYPE_Y &&
      this.props.thumbYProps.onDragStart &&
      this.props.thumbYProps.onDragStart(params);
  };

  handleThumbDragEnd = params => {
    params.axis === TYPE_X &&
      this.props.thumbXProps.onDragEnd &&
      this.props.thumbXProps.onDragEnd(params);
    params.axis === TYPE_Y &&
      this.props.thumbYProps.onDragEnd &&
      this.props.thumbYProps.onDragEnd(params);
  };

  handleThumbDrag = params => {
    this.scrollDetect();

    params.axis === TYPE_X &&
      this.props.thumbXProps.onDrag &&
      this.props.thumbXProps.onDrag(params);
    params.axis === TYPE_Y &&
      this.props.thumbYProps.onDrag &&
      this.props.thumbYProps.onDrag(params);

    params.axis === TYPE_X
      ? (this.contentEl.scrollLeft = Scrollbar.computeScrollForOffset(
          getInnerWidth(this.trackXEl),
          this.thumbXEl.clientWidth,
          params.offset,
          this.contentEl.scrollWidth,
          this.contentEl.clientWidth
        ))
      : (this.contentEl.scrollTop = Scrollbar.computeScrollForOffset(
          getInnerHeight(this.trackYEl),
          this.thumbYEl.clientHeight,
          params.offset,
          this.contentEl.scrollHeight,
          this.contentEl.clientHeight
        ));
  };

  render() {
    const {
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

      captureScroll,

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
    const { trackXVisible, trackYVisible } = this.state;

    const browserSBW = getScrollbarWidth();
    const scrollbarWidth = browserSBW || fallbackScrollbarWidth;

    const wrapperProps = { ...propsWrapperProps },
      contentProps = { ...propsContentProps },
      trackXProps = { ...propsTrackXProps },
      trackYProps = { ...propsTrackYProps },
      thumbXProps = { ...propsThumbXProps },
      thumbYProps = { ...propsThumbYProps };

    if (!noDefaultStyles) {
      props.style = {
        ...defaultStyles.holder
      };
      wrapperProps.style = {
        ...defaultStyles.wrapper,
        [this.state.isRtl ? "marginLeft" : "marginRight"]: trackYVisible
          ? 8
          : null,
        marginBottom: trackXVisible ? 8 : null
      };
      trackXProps.style = {
        ...defaultStyles.track.common,
        ...defaultStyles.track.x
      };
      trackYProps.style = {
        ...defaultStyles.track.common,
        ...defaultStyles.track.y,
        [this.state.isRtl ? "left" : "right"]: 0
      };
      thumbXProps.style = {
        ...defaultStyles.thumb.common,
        ...defaultStyles.thumb.x
      };
      thumbYProps.style = {
        ...defaultStyles.thumb.common,
        ...defaultStyles.thumb.y
      };
    }

    props.style = {
      ...props.style,
      ...style,
      ...(typeof rtl !== "undefined" && { direction: rtl ? "rtl" : "ltr" })
    };
    wrapperProps.style = {
      ...wrapperProps.style,
      ...propsWrapperProps.style,
      position: "relative",
      overflow: "hidden"
    };
    contentProps.style = {
      ...defaultStyles.content,
      ...propsContentProps.style,
      ...(momentum && { WebkitOverflowScrolling: "touch" }),

      overflowY: this.scrollValues.scrollYPossible ? "scroll" : "hidden",
      ...(this.state.isRtl
        ? {
            paddingLeft:
              !browserSBW && this.scrollValues.scrollYPossible
                ? scrollbarWidth
                : null,
            marginLeft: this.scrollValues.scrollYPossible
              ? -scrollbarWidth
              : null
          }
        : {
            paddingRight:
              !browserSBW && this.scrollValues.scrollYPossible
                ? scrollbarWidth
                : null,
            marginRight: this.scrollValues.scrollYPossible
              ? -scrollbarWidth
              : null
          }),

      overflowX: this.scrollValues.scrollXPossible ? "scroll" : "hidden",
      paddingBottom:
        !browserSBW && this.scrollValues.scrollXPossible
          ? scrollbarWidth
          : null,
      marginBottom: this.scrollValues.scrollXPossible ? -scrollbarWidth : null
    };
    trackXProps.style = {
      ...trackXProps.style,
      ...propsTrackXProps.style
    };
    trackYProps.style = {
      ...trackYProps.style,
      ...propsTrackYProps.style
    };
    thumbXProps.style = {
      ...thumbXProps.style,
      ...propsThumbXProps.style
    };
    thumbYProps.style = {
      ...thumbYProps.style,
      ...propsThumbYProps.style
    };

    props.className =
      "ScrollbarsCustom" +
      (trackYVisible ? " trackYVisible" : "") +
      (trackYVisible ? " trackXVisible" : "") +
      (this.state.isRtl ? " rtl" : "") +
      (className ? " " + className : "");
    contentProps.className =
      "content" + (contentProps.className ? " " + contentProps.className : "");
    wrapperProps.className =
      "wrapper" + (wrapperProps.className ? " " + wrapperProps.className : "");

    props.ref = ref => {
      this.holderEl = ref;
    };
    wrapperProps.ref = ref => {
      this.wrapperEl = ref;
    };
    contentProps.ref = ref => {
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

    wrapperProps.children = contentRenderer ? (
      contentRenderer(contentProps)
    ) : (
      <div {...contentProps} />
    );

    return (
      <this.props.tagName {...props}>
        {wrapperRenderer ? (
          wrapperRenderer(wrapperProps)
        ) : (
          <div {...wrapperProps} />
        )}

        {(trackYVisible ||
          !(removeTracksWhenNotUsed && removeTrackYWhenNotUsed)) && (
          <Track type={TYPE_Y} {...trackYProps}>
            <Thumb type={TYPE_Y} {...thumbYProps} />
          </Track>
        )}

        {(trackXVisible ||
          !(removeTracksWhenNotUsed && removeTrackXWhenNotUsed)) && (
          <Track type={TYPE_X} {...trackXProps}>
            <Thumb type={TYPE_X} {...thumbXProps} />
          </Track>
        )}
      </this.props.tagName>
    );
  }
}
