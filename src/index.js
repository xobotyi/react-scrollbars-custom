import PropTypes                         from "prop-types";
import React                             from 'react';
import Thumb                             from './Thumb';
import Track, { TYPE_X, TYPE_Y }         from './Track';
import { getInnerHeight, getInnerWidth } from "./util/getInnerSizes";
import LoopController                    from "./util/LoopController";
import { getScrollbarWidth }             from "./util/utilities";

const defaultStyles = {
    holder:  {
        position: "relative",
        display:  "flex",
    },
    wrapper: {
        flexGrow: 1,
    },
    content: {
        position: "absolute",
        top:      0,
        bottom:   0,
        right:    0,
        left:     0,
    },
    track:   {
        common: {
            position:     "absolute",
            overflow:     "hidden",
            borderRadius: 4,
            background:   "rgba(0,0,0,.1)",
            userSelect:   "none",
        },
        x:      {
            height: 8,
            width:  "calc(100% - 16px)",
            bottom: 0,
            left:   8,
        },
        y:      {
            width:  8,
            height: "calc(100% - 16px)",
            top:    8,
        },
    },
    thumb:   {
        common: {
            cursor:       "pointer",
            borderRadius: 4,
            background:   "rgba(0,0,0,.4)",
        },
        x:      {
            height: "100%",
        },
        y:      {
            width: "100%",
        },
    },
};

export default class Scrollbar extends React.Component
{
    static propTypes = {
        minimalThumbsSize:      PropTypes.number,
        fallbackScrollbarWidth: PropTypes.number,

        tagName:   PropTypes.string,
        className: PropTypes.string,
        style:     PropTypes.object,

        rtl: PropTypes.bool,

        momentum: PropTypes.bool,

        noDefaultStyles: PropTypes.bool,

        trackClickBehavior: PropTypes.oneOf(["jump", "step"]),

        noScrollX: PropTypes.bool,
        noScrollY: PropTypes.bool,
        noScroll:  PropTypes.bool,

        removeTracksWhenNotUsed: PropTypes.bool,
        removeTrackYWhenNotUsed: PropTypes.bool,
        removeTrackXWhenNotUsed: PropTypes.bool,

        permanentTrackX: PropTypes.bool,
        permanentTrackY: PropTypes.bool,
        permanentTracks: PropTypes.bool,

        wrapperProps: PropTypes.object,
        contentProps: PropTypes.object,
        trackXProps:  PropTypes.object,
        trackYProps:  PropTypes.object,
        thumbXProps:  PropTypes.object,
        thumbYProps:  PropTypes.object,

        wrapperRenderer: PropTypes.func,
        contentRenderer: PropTypes.func,
        trackXRenderer:  PropTypes.func,
        trackYRenderer:  PropTypes.func,
        thumbXRenderer:  PropTypes.func,
        thumbYRenderer:  PropTypes.func,
    };

    static defaultProps = {
        tagName:                "div",
        minimalThumbsSize:      30,
        fallbackScrollbarWidth: 20,

        trackClickBehavior: "jump",

        momentum: false,

        noDefaultStyles: false,

        noScrollX: false,
        noScrollY: false,
        noScroll:  false,

        permanentTrackX: false,
        permanentTrackY: false,
        permanentTracks: false,

        removeTracksWhenNotUsed: true,
        removeTrackYWhenNotUsed: true,
        removeTrackXWhenNotUsed: true,

        wrapperProps: {},
        contentProps: {},
        trackXProps:  {},
        trackYProps:  {},
        thumbXProps:  {},
        thumbYProps:  {},
    };

    constructor(props) {
        super(props);

        this.scrollValues = {
            clientHeight:    null,
            clientWidth:     null,
            scrollHeight:    null,
            scrollWidth:     null,
            scrollTop:       null,
            scrollLeft:      null,
            scrollYBlocked:  null,
            scrollXBlocked:  null,
            scrollYPossible: null,
            scrollXPossible: null,
            trackYVisible:   null,
            trackXVisible:   null,
        };

        this.state = {
            trackYVisible: true,
            trackXVisible: true,
            isRtl:         this.props.rtl,
        };
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
        //let a = performance.now();
        //for (let i = 0; i < 1000000; i++) {
        //    this.update();
        //}
        //let b = performance.now();
        //console.log((b - a).toFixed(4), (1000000 * 1000 / (b - a)).toFixed(4));
        LoopController.registerScrollbar(this);
        this.update();
    }

    componentWillUnmount() {
        LoopController.unregisterScrollbar(this);
    }

    update = (forced = false) => {
        if (typeof this.state.isRtl !== 'boolean') {
            this.setState({isRtl: getComputedStyle(this.contentEl).direction === 'rtl'});

            return;
        }

        const currentScrollValues = {
            clientHeight: this.contentEl.clientHeight * 1,
            scrollHeight: this.contentEl.scrollHeight * 1,
            scrollTop:    this.contentEl.scrollTop * 1,
            clientWidth:  this.contentEl.clientWidth * 1,
            scrollWidth:  this.contentEl.scrollWidth * 1,
            scrollLeft:   this.contentEl.scrollLeft * 1,
        };
        currentScrollValues.scrollXBlocked = this.props.noScroll || this.props.noScrollX;
        currentScrollValues.scrollYBlocked = this.props.noScroll || this.props.noScrollY;
        currentScrollValues.scrollXPossible = !currentScrollValues.scrollXBlocked && currentScrollValues.scrollWidth > currentScrollValues.clientWidth;
        currentScrollValues.scrollYPossible = !currentScrollValues.scrollYBlocked && currentScrollValues.scrollHeight > currentScrollValues.clientHeight;
        currentScrollValues.trackXVisible = currentScrollValues.scrollXPossible || this.props.permanentTracks || this.props.permanentTrackX;
        currentScrollValues.trackYVisible = currentScrollValues.scrollYPossible || this.props.permanentTracks || this.props.permanentTrackY;

        let mask = 0;

        this.scrollValues.clientHeight !== currentScrollValues.clientHeight && (mask |= (1 << 0));
        this.scrollValues.clientWidth !== currentScrollValues.clientWidth && (mask |= (1 << 1));
        this.scrollValues.scrollHeight !== currentScrollValues.scrollHeight && (mask |= (1 << 2));
        this.scrollValues.scrollWidth !== currentScrollValues.scrollWidth && (mask |= (1 << 3));
        this.scrollValues.scrollTop !== currentScrollValues.scrollTop && (mask |= (1 << 4));
        this.scrollValues.scrollLeft !== currentScrollValues.scrollLeft && (mask |= (1 << 5));
        this.scrollValues.scrollYBlocked !== currentScrollValues.scrollYBlocked && (mask |= (1 << 6));
        this.scrollValues.scrollXBlocked !== currentScrollValues.scrollXBlocked && (mask |= (1 << 7));
        this.scrollValues.scrollYPossible !== currentScrollValues.scrollYPossible && (mask |= (1 << 8));
        this.scrollValues.scrollXPossible !== currentScrollValues.scrollXPossible && (mask |= (1 << 9));
        this.scrollValues.trackYVisible !== currentScrollValues.trackYVisible && (mask |= (1 << 10));
        this.scrollValues.trackXVisible !== currentScrollValues.trackXVisible && (mask |= (1 << 11));

        // if not forced and nothing has changed - do not update
        if (mask === 0 && !forced) { return false; }

        // if scrollbars visibility has changed
        if ((mask & (1 << 10)) || (mask & (1 << 11))) {
            this.scrollValues.trackYVisible = currentScrollValues.trackYVisible;
            this.scrollValues.trackXVisible = currentScrollValues.trackXVisible;

            this.setState({
                              trackYVisible: currentScrollValues.trackYVisible,
                              trackXVisible: currentScrollValues.trackXVisible,
                          });

            return this.update(true);
        }

        // if Y track rendered and changed anything related to scrollY
        if (this.trackYEl) {
            (mask & (1 << 10)) && (this.trackYEl.style.display = currentScrollValues.trackYVisible ? null : "none");

            if ((mask & (1 << 0)) || (mask & (1 << 2)) || (mask & (1 << 4)) || (mask & (1 << 6)) || (mask & (1 << 8))) {
                if (currentScrollValues.scrollYPossible) {
                    const trackSize = getInnerHeight(this.trackYEl);
                    const thumbSize = this.computeThumbSize(trackSize,
                                                            currentScrollValues.scrollHeight,
                                                            currentScrollValues.clientHeight);
                    const thumbOffset = this.computeThumbOffset(trackSize,
                                                                thumbSize,
                                                                currentScrollValues.scrollHeight,
                                                                currentScrollValues.clientHeight,
                                                                currentScrollValues.scrollTop);

                    this.thumbYEl.style.transform = `translateY(${thumbOffset}px)`;
                    this.thumbYEl.style.height = thumbSize + 'px';
                    this.thumbYEl.style.display = null;
                }
                else {
                    this.thumbYEl.style.transform = null;
                    this.thumbYEl.style.height = "0px";
                    this.thumbYEl.style.display = "none";
                }
            }
        }

        // if X track rendered and changed anything related to scrollX
        if (this.trackXEl) {
            (mask & (1 << 11)) && (this.trackXEl.style.display = currentScrollValues.trackXVisible ? null : "none");

            if ((mask & (1 << 1)) || (mask & (1 << 3)) || (mask & (1 << 5)) || (mask & (1 << 7)) || (mask & (1 << 9))) {
                if (currentScrollValues.scrollXPossible) {
                    const trackSize = getInnerWidth(this.trackXEl);
                    const thumbSize = this.computeThumbSize(trackSize,
                                                            currentScrollValues.scrollWidth,
                                                            currentScrollValues.clientWidth);
                    let thumbOffset = this.computeThumbOffset(trackSize,
                                                              thumbSize,
                                                              currentScrollValues.scrollWidth,
                                                              currentScrollValues.clientWidth,
                                                              currentScrollValues.scrollLeft);

                    console.log(trackSize, thumbSize, thumbOffset);

                    if (this.state.isRtl) {
                        thumbOffset = thumbSize + thumbOffset - trackSize;
                    }

                    this.thumbXEl.style.transform = `translateX(${thumbOffset}px)`;
                    this.thumbXEl.style.width = thumbSize + 'px';
                    this.thumbXEl.style.display = null;
                }
                else {
                    this.thumbXEl.style.transform = null;
                    this.thumbXEl.style.width = "0px";
                    this.thumbXEl.style.display = "none";
                }
            }
        }

        return this.scrollValues = currentScrollValues;
    };

    computeThumbSize(trackSize, scrollableSize, viewportSize) {
        const size = Math.ceil((viewportSize / scrollableSize) * trackSize);

        return trackSize === size ? 0 : Math.max(size, this.props.minimalThumbsSize);
    }

    computeThumbOffset(trackSize, thumbSize, scrollableSize, viewportSize, scrollValue) {
        return thumbSize && ((scrollValue / (scrollableSize - viewportSize)) * (trackSize - thumbSize));
    }

    computeScrollForOffset(trackSize, thumbSize, offset, scrollableSize, viewportSize) {
        return ((offset - thumbSize / 2) / (trackSize - thumbSize)) * (scrollableSize - viewportSize);
    };

    handleTrackClick = (e, params) => {
        params.axis === TYPE_X && this.props.trackXProps.onClick && this.props.trackXProps.onClick(e, params);
        params.axis === TYPE_Y && this.props.trackYProps.onClick && this.props.trackYProps.onClick(e, params);

        const scrollTarget = params.axis === TYPE_X
                             ? this.computeScrollForOffset(getInnerWidth(this.trackXEl),
                                                           this.thumbXEl.clientWidth,
                                                           params.offset,
                                                           this.contentEl.scrollWidth,
                                                           this.contentEl.clientWidth)
                             : this.computeScrollForOffset(getInnerHeight(this.trackYEl),
                                                           this.thumbYEl.clientHeight,
                                                           params.offset,
                                                           this.contentEl.scrollHeight,
                                                           this.contentEl.clientHeight);

        if (this.props.trackClickBehavior === "jump") {
            params.axis === TYPE_X
            && (this.contentEl.scrollLeft = scrollTarget);
            params.axis === TYPE_Y
            && (this.contentEl.scrollTop = scrollTarget);
        }
        else if (this.props.trackClickBehavior === "step") {
            params.axis === TYPE_X
            && (this.contentEl.scrollLeft = this.contentEl.scrollLeft < scrollTarget
                                            ? this.contentEl.scrollLeft + this.contentEl.clientWidth
                                            : this.contentEl.scrollLeft - this.contentEl.clientWidth);
            params.axis === TYPE_Y
            && (this.contentEl.scrollTop = this.contentEl.scrollTop < scrollTarget
                                           ? this.contentEl.scrollTop + this.contentEl.clientHeight
                                           : this.contentEl.scrollTop - this.contentEl.clientHeight);
        }
    };

    handleThumbDragStart = (params) => {
        params.axis === TYPE_X && this.props.thumbXProps.onDragStart && this.props.thumbXProps.onDragStart(params);
        params.axis === TYPE_Y && this.props.thumbYProps.onDragStart && this.props.thumbYProps.onDragStart(params);
    };

    handleThumbDragEnd = (params) => {
        params.axis === TYPE_X && this.props.thumbXProps.onDragEnd && this.props.thumbXProps.onDragEnd(params);
        params.axis === TYPE_Y && this.props.thumbYProps.onDragEnd && this.props.thumbYProps.onDragEnd(params);
    };

    handleThumbDrag = (params) => {
        params.axis === TYPE_X && this.props.thumbXProps.onDrag && this.props.thumbXProps.onDrag(params);
        params.axis === TYPE_Y && this.props.thumbYProps.onDrag && this.props.thumbYProps.onDrag(params);

        params.axis === TYPE_X
        ? this.contentEl.scrollLeft = this.computeScrollForOffset(getInnerWidth(this.trackXEl),
                                                                  this.thumbXEl.clientWidth,
                                                                  params.offset,
                                                                  this.contentEl.scrollWidth,
                                                                  this.contentEl.clientWidth)
        : this.contentEl.scrollTop = this.computeScrollForOffset(getInnerHeight(this.trackYEl),
                                                                 this.thumbYEl.clientHeight,
                                                                 params.offset,
                                                                 this.contentEl.scrollHeight,
                                                                 this.contentEl.clientHeight);
    };

    render() {
        const {
                  minimalThumbsSize,
                  fallbackScrollbarWidth,

                  tagName,
                  className,
                  style,

                  trackClickBehavior,

                  rtl,

                  momentum,

                  noDefaultStyles,

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

                  children,
                  ...props
              } = this.props;
        const {trackXVisible, trackYVisible} = this.state;

        const scrollbarWidth = getScrollbarWidth() || fallbackScrollbarWidth;

        const wrapperProps = {...propsWrapperProps},
              contentProps = {...propsContentProps},
              trackXProps  = {...propsTrackXProps},
              trackYProps  = {...propsTrackYProps},
              thumbXProps  = {...propsThumbXProps},
              thumbYProps  = {...propsThumbYProps};

        if (!noDefaultStyles) {
            props.style = {
                ...defaultStyles.holder,
            };
            wrapperProps.style = {
                ...defaultStyles.wrapper,
                [this.state.isRtl ? "marginLeft" : "marginRight"]: trackYVisible ? 8 : null,
                marginBottom:                                      trackXVisible ? 8 : null,
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
            ...(typeof rtl !== 'undefined' && {direction: rtl ? "rtl" : "ltr"}),
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

            overflowY: this.scrollValues.scrollYPossible ? "scroll" : "hidden",
            ...(
                    this.state.isRtl
                    ? {
                                paddingLeft: this.scrollValues.scrollYPossible ? scrollbarWidth : null,
                                marginLeft:  this.scrollValues.scrollYPossible ? -scrollbarWidth : null,
                            }
                    : {
                                paddingRight: this.scrollValues.scrollYPossible ? scrollbarWidth : null,
                                marginRight:  this.scrollValues.scrollYPossible ? -scrollbarWidth : null,
                            }

            ),

            overflowX:     this.scrollValues.scrollXPossible ? "scroll" : "hidden",
            paddingBottom: this.scrollValues.scrollXPossible ? scrollbarWidth : null,
            marginBottom:  this.scrollValues.scrollXPossible ? -scrollbarWidth : null,
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

        props.className = "ScrollbarsCustom"
                          + (trackYVisible ? " trackYVisible" : "")
                          + (trackYVisible ? " trackXVisible" : "")
                          + (this.state.isRtl ? " rtl" : "")
                          + (className ? " " + className : "");
        contentProps.className = "content" + (contentProps.className ? " " + contentProps.className : "");
        wrapperProps.className = "wrapper" + (wrapperProps.className ? " " + wrapperProps.className : "");

        props.ref = (ref) => { this.holderEl = ref; };
        wrapperProps.ref = (ref) => { this.wrapperEl = ref; };
        contentProps.ref = (ref) => { this.contentEl = ref; };
        trackXProps.elementRef = (ref) => { this.trackXEl = ref; };
        trackYProps.elementRef = (ref) => { this.trackYEl = ref; };
        thumbXProps.elementRef = (ref) => { this.thumbXEl = ref; };
        thumbYProps.elementRef = (ref) => { this.thumbYEl = ref; };

        trackXProps.renderer = trackXRenderer;
        trackYProps.renderer = trackYRenderer;
        thumbXProps.renderer = thumbXRenderer;
        thumbYProps.renderer = thumbYRenderer;

        trackYProps.onClick = trackXProps.onClick = this.handleTrackClick;

        thumbYProps.onDragStart = thumbXProps.onDragStart = this.handleThumbDragStart;
        thumbYProps.onDragEnd = thumbXProps.onDragEnd = this.handleThumbDragEnd;
        thumbYProps.onDrag = thumbXProps.onDrag = this.handleThumbDrag;

        contentProps.children = children;

        wrapperProps.children = contentRenderer ? contentRenderer(contentProps) : (<div { ...contentProps } />);

        return (
                <this.props.tagName { ...props }>
                    { wrapperRenderer ? wrapperRenderer(wrapperProps) : (<div { ...wrapperProps } />) }

                    { (trackYVisible || !(removeTracksWhenNotUsed && removeTrackYWhenNotUsed)) && (
                            <Track type={ TYPE_Y } { ...trackYProps }>
                                <Thumb type={ TYPE_Y } { ...thumbYProps } />
                            </Track>
                    ) }

                    { (trackXVisible || !(removeTracksWhenNotUsed && removeTrackXWhenNotUsed)) && (
                            <Track type={ TYPE_X } { ...trackXProps }>
                                <Thumb type={ TYPE_X }{ ...thumbXProps } />
                            </Track>
                    ) }
                </this.props.tagName>
        );
    }
}
